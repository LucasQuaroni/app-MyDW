import { useState, useEffect, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";
import imageCompression from "browser-image-compression";
import {
  Camera,
  Image as ImageIcon,
  X,
  Loader2,
  CheckCircle2,
  Upload,
  CloudUpload,
  AlertCircle,
} from "lucide-react";

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
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Helper function to process a file (extracted from handleFileSelect)
  const processFile = async (file: File) => {
    setError(null);

    if (previews.length >= maxImages) {
      if (maxImages === 1) {
        setPreviews([]);
      } else {
        setError(`Máximo ${maxImages} imágenes permitidas`);
        return;
      }
    }

    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP)");
      return;
    }

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      setError("La imagen es muy grande. Máximo 10MB permitidos");
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
      setError("Error al procesar la imagen. Por favor, intenta de nuevo.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    e.target.value = "";
    await processFile(file);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (uploading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
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
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm md:text-base font-semibold text-gray-200 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-orange-400" />
          <span>
            {maxImages === 1 ? "Foto de la Mascota" : "Fotos de la Mascota"}
          </span>
          {maxImages > 1 && (
            <span className="text-xs md:text-sm text-gray-400 font-normal ml-1">
              ({previews.length}/{maxImages})
            </span>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg md:rounded-xl p-3 md:p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base text-red-300 font-semibold">
                Error
              </p>
              <p className="text-xs md:text-sm text-red-200 mt-1">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 transition-colors shrink-0"
              aria-label="Cerrar mensaje de error"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div
          className={
            maxImages === 1
              ? "flex justify-center"
              : "grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
          }
        >
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative overflow-hidden rounded-xl md:rounded-2xl border-2 border-gray-700 hover:border-orange-500/50 transition-all duration-200">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className={
                    maxImages === 1
                      ? "w-full max-w-md h-64 md:h-80 object-cover"
                      : "w-full h-32 md:h-40 object-cover"
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <button
                type="button"
                onClick={() => removePreview(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-110"
                title="Eliminar imagen"
                aria-label="Eliminar imagen"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="w-full bg-gray-700/50 rounded-full h-2.5 md:h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-300 shadow-lg"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs md:text-sm text-gray-400 text-center">
            {uploadProgress < 50
              ? "Comprimiendo imagen..."
              : uploadProgress < 90
              ? "Subiendo imagen..."
              : "Finalizando..."}
          </p>
        </div>
      )}

      {/* Upload Buttons - Mobile: Camera & Gallery, Desktop: Drag & Drop */}
      {canAddMore && (
        <>
          {/* Mobile: Camera & Gallery buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 md:hidden">
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
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white text-center transition-all duration-200 ${
                  uploading
                    ? "bg-gray-600/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Tomar Foto</span>
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
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white text-center transition-all duration-200 ${
                  uploading
                    ? "bg-gray-600/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Elegir de Galería</span>
              </div>
            </label>
          </div>

          {/* Desktop: Drag & Drop Area */}
          <div className="hidden md:block">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClickUpload}
              className={`relative border-2 border-dashed rounded-xl md:rounded-2xl p-6 md:p-8 transition-all duration-200 cursor-pointer ${
                isDragging
                  ? "border-orange-500 bg-orange-500/10 scale-[1.02]"
                  : uploading
                  ? "border-gray-600 bg-gray-800/30 cursor-not-allowed"
                  : "border-gray-700 bg-gray-800/30 hover:border-orange-500/50 hover:bg-gray-800/50"
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div
                  className={`p-4 rounded-full transition-all duration-200 ${
                    isDragging
                      ? "bg-orange-500/20 scale-110"
                      : uploading
                      ? "bg-gray-700/50"
                      : "bg-gray-700/50 group-hover:bg-orange-500/10"
                  }`}
                >
                  {uploading ? (
                    <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-gray-400 animate-spin" />
                  ) : (
                    <CloudUpload
                      className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-200 ${
                        isDragging ? "text-orange-400" : "text-gray-400"
                      }`}
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <p
                    className={`text-sm md:text-base font-semibold transition-colors duration-200 ${
                      isDragging
                        ? "text-orange-400"
                        : uploading
                        ? "text-gray-500"
                        : "text-gray-300"
                    }`}
                  >
                    {uploading
                      ? "Subiendo imagen..."
                      : isDragging
                      ? "Suelta la imagen aquí"
                      : "Arrastra una imagen aquí o haz clic para seleccionar"}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    PNG, JPG, WEBP hasta 10MB
                  </p>
                </div>
                {!uploading && !isDragging && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm md:text-base font-semibold rounded-lg md:rounded-xl shadow-md hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-200 hover:scale-105"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickUpload();
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Seleccionar archivo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Status Messages */}
      {uploading && (
        <div className="flex items-center gap-2 text-sm md:text-base text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 md:px-4 py-2 md:py-2.5">
          <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin flex-shrink-0" />
          <span>Subiendo y optimizando imagen...</span>
        </div>
      )}

      {!canAddMore && maxImages > 1 && (
        <div className="flex items-center gap-2 text-sm md:text-base text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 md:px-4 py-2 md:py-2.5">
          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
          <span>Alcanzaste el límite de {maxImages} imágenes</span>
        </div>
      )}

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 md:px-4 py-2 md:py-2.5">
        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
          <span className="font-semibold text-gray-300">Nota: </span>
          {maxImages === 1
            ? "La imagen se comprime automáticamente para optimizar el almacenamiento. Tamaño máximo: 10MB."
            : "Las imágenes se comprimen automáticamente para optimizar el almacenamiento. Tamaño máximo: 10MB por imagen."}
        </p>
      </div>
    </div>
  );
};
