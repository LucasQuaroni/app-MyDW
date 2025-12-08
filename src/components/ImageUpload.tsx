import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";
import imageCompression from "browser-image-compression";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  petName?: string;
  maxImages?: number;
  currentImages?: string[];
  onUploadingChange?: (isUploading: boolean) => void;
}

export const ImageUpload = ({
  onImageUploaded,
  petName = "pet",
  maxImages = 5,
  currentImages = [],
  onUploadingChange,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previews, setPreviews] = useState<string[]>(currentImages);

  // Sync previews with currentImages when they change
  useEffect(() => {
    setPreviews(currentImages);
  }, [currentImages]);

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1, // Maximum file size in MB
      maxWidthOrHeight: 1920, // Maximum width or height
      useWebWorker: true,
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error("Error compressing image:", error);
      return file;
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    e.target.value = "";

    if (previews.length >= maxImages) {
      if (maxImages === 1) {
        setPreviews([]);
      } else {
        alert(`Máximo ${maxImages} imágenes permitidas`);
        return;
      }
    }

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido");
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      alert("La imagen es muy grande. Máximo 10MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => [...prev, previewUrl]);

    setUploading(true);
    onUploadingChange?.(true);
    setUploadProgress(10);

    try {
      setUploadProgress(30);
      const compressedFile = await compressImage(file);
      console.log(
        `Compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(
          compressedFile.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );

      setUploadProgress(50);
      await uploadImage(compressedFile);

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error processing image:", error);
      setPreviews((prev) => prev.filter((p) => p !== previewUrl));
      alert("Error al procesar la imagen. Intenta de nuevo.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      setUploadProgress(0);
    }
  };

  const uploadImage = async (file: File) => {
    try {
      // Create unique filename with timestamp
      const timestamp = Date.now();
      const sanitizedPetName = petName.replace(/[^a-zA-Z0-9]/g, "_");
      const fileExtension = file.name.split(".").pop();
      const filename = `pets/${sanitizedPetName}_${timestamp}.${fileExtension}`;

      // Create storage reference
      const storageRef = ref(storage, filename);

      // Upload file
      setUploadProgress(75);
      await uploadBytes(storageRef, file);

      // Get download URL
      setUploadProgress(90);
      const downloadURL = await getDownloadURL(storageRef);

      // Notify parent component
      onImageUploaded(downloadURL);
      setUploadProgress(100);

      // Success feedback
      console.log("Image uploaded successfully:", downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Re-throw to be caught by caller
    }
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const canAddMore = previews.length < maxImages;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {maxImages === 1 ? "Foto de la Mascota" : "Fotos de la Mascota"}
        {maxImages > 1 && (
          <span className="text-gray-500 ml-2">
            ({previews.length}/{maxImages})
          </span>
        )}
      </label>

      {/* Image Previews */}
      {previews.length > 0 && (
        <div
          className={
            maxImages === 1
              ? "flex justify-center"
              : "grid grid-cols-2 md:grid-cols-3 gap-3"
          }
        >
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className={
                  maxImages === 1
                    ? "w-full max-w-md h-64 object-cover rounded-xl border-2 border-gray-700"
                    : "w-full h-32 object-cover rounded-xl border-2 border-gray-700"
                }
              />
              <button
                type="button"
                onClick={() => removePreview(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Eliminar imagen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && uploadProgress > 0 && (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-orange-500 to-amber-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* Upload Buttons */}
      {canAddMore && (
        <div className="flex gap-2">
          {/* Camera input (mobile will show camera option) */}
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <div
              className={`py-2.5 px-4 rounded-xl text-sm font-semibold text-white text-center transition-all ${
                uploading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
              }`}
            >
              📷 Tomar Foto
            </div>
          </label>

          {/* Gallery input */}
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <div
              className={`py-2.5 px-4 rounded-xl text-sm font-semibold text-white text-center transition-all ${
                uploading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg"
              }`}
            >
              🖼️ Elegir de Galería
            </div>
          </label>
        </div>
      )}

      {/* Status Messages */}
      {uploading && (
        <p className="text-sm text-blue-400 flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Subiendo y optimizando imagen...
        </p>
      )}

      {!canAddMore && maxImages > 1 && (
        <p className="text-sm text-amber-400">
          Alcanzaste el límite de {maxImages} imágenes
        </p>
      )}

      <p className="text-xs text-gray-500">
        {maxImages === 1
          ? "La imagen se comprime automáticamente. Tamaño máximo: 10MB."
          : "Las imágenes se comprimen automáticamente. Tamaño máximo: 10MB por imagen."}
      </p>
    </div>
  );
};
