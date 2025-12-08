import { useState, useEffect, useRef } from "react";
import QRCode from "react-qr-code";
import { api } from "../../config/axios";

interface Tag {
  _id: string;
  tagId: string;
  qrUrl: string;
  batchNumber: string;
  isActivated: boolean;
  createdAt: string;
}

const TagGenerator = () => {
  const [quantity, setQuantity] = useState(10);
  const [batchNumber, setBatchNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoadingTags(true);
      const response = await api.get("/tags/all");
      setTags(response.data || []);
    } catch (err: any) {
      console.error("Error al cargar tags:", err);
      setTags([]);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleGenerateTags = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/tags/generate", {
        quantity,
        batchNumber: batchNumber || `LOTE-${Date.now()}`,
      });

      setSuccess(
        `✅ ${response.data.message || "Tags generados exitosamente"}`
      );

      // Recargar la lista de tags
      await fetchTags();

      // Limpiar formulario
      setQuantity(10);
      setBatchNumber("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al generar tags");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintTag = (tag: Tag) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Chapita ${tag.tagId}</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
              background: white;
            }
            .tag-container {
              text-align: center;
              padding: 20px;
              border: 2px solid #333;
              border-radius: 10px;
            }
            .qr-code {
              margin: 20px 0;
            }
            h2 {
              margin: 10px 0;
              font-size: 24px;
            }
            .tag-id {
              font-family: monospace;
              font-size: 18px;
              font-weight: bold;
              margin: 10px 0;
            }
            .url {
              font-size: 12px;
              color: #666;
              word-break: break-all;
              margin: 10px 0;
            }
            @media print {
              body {
                background: white;
              }
              .tag-container {
                border: 1px solid #000;
              }
            }
          </style>
        </head>
        <body>
          <div class="tag-container">
            <h2>🐾 e-patitas</h2>
            <div class="qr-code">
              ${document.getElementById(`qr-${tag.tagId}`)?.innerHTML || ""}
            </div>
            <div class="tag-id">${tag.tagId}</div>
            <div class="url">${tag.qrUrl}</div>
            <p style="font-size: 10px; color: #999;">
              Lote: ${tag.batchNumber}
            </p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handlePrintAll = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const tagsHtml = tags
      .map(
        (tag) => `
      <div class="tag-page">
        <div class="tag-container">
          <h2>🐾 e-patitas</h2>
          <div class="qr-code">
            ${document.getElementById(`qr-${tag.tagId}`)?.innerHTML || ""}
          </div>
          <div class="tag-id">${tag.tagId}</div>
          <div class="url">${tag.qrUrl}</div>
          <p style="font-size: 10px; color: #999;">
            Lote: ${tag.batchNumber} | Estado: ${
          tag.isActivated ? "Activada" : "Disponible"
        }
          </p>
        </div>
      </div>
    `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Todas las Chapitas</title>
          <style>
            body {
              margin: 0;
              font-family: Arial, sans-serif;
              background: white;
            }
            .tag-page {
              page-break-after: always;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              padding: 20px;
            }
            .tag-container {
              text-align: center;
              padding: 20px;
              border: 2px solid #333;
              border-radius: 10px;
            }
            .qr-code {
              margin: 20px 0;
            }
            h2 {
              margin: 10px 0;
              font-size: 24px;
            }
            .tag-id {
              font-family: monospace;
              font-size: 18px;
              font-weight: bold;
              margin: 10px 0;
            }
            .url {
              font-size: 12px;
              color: #666;
              word-break: break-all;
              margin: 10px 0;
            }
            @media print {
              .tag-page:last-child {
                page-break-after: auto;
              }
            }
          </style>
        </head>
        <body>
          ${tagsHtml}
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          🏷️ Generador de Chapitas
        </h1>
        <p className="text-gray-400">
          Genera y gestiona las chapitas identificadoras con QR
        </p>
      </div>

      {/* Formulario de Generación */}
      <div className="bg-gray-800 rounded-3xl shadow-md p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Generar Nuevo Lote
        </h2>

        <form onSubmit={handleGenerateTags} className="space-y-4">
          {error && (
            <div
              className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-2xl text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              className="bg-green-900/30 border border-green-800 text-green-300 px-4 py-3 rounded-2xl text-sm"
              role="alert"
            >
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Cantidad de Chapitas
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="batchNumber"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Número de Lote (opcional)
              </label>
              <input
                id="batchNumber"
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="Ej: LOTE-2025-01"
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Generando..." : "🚀 Generar Chapitas"}
          </button>
        </form>
      </div>

      {/* Lista de Tags */}
      <div className="bg-gray-800 rounded-3xl shadow-md p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-100">
            Chapitas Generadas ({tags.length})
          </h2>
          {tags.length > 0 && (
            <button
              onClick={handlePrintAll}
              className="py-2 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
            >
              🖨️ Imprimir Todas
            </button>
          )}
        </div>

        {loadingTags ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando chapitas...</p>
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-400">
              No hay chapitas generadas aún. ¡Genera tu primer lote!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tags.map((tag) => (
              <div
                key={tag._id}
                className="bg-gray-900 rounded-2xl p-4 border border-gray-700 hover:border-orange-500 transition-all"
              >
                {/* QR Code */}
                <div className="bg-white p-4 rounded-xl mb-3 flex justify-center">
                  <div id={`qr-${tag.tagId}`}>
                    <QRCode value={tag.qrUrl} size={128} level="H" />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">ID</p>
                    <p className="text-sm font-mono text-gray-300 break-all">
                      {tag.tagId}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Lote</p>
                    <p className="text-sm text-gray-400">{tag.batchNumber}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Estado</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-lg text-xs font-semibold ${
                        tag.isActivated
                          ? "bg-green-900/30 text-green-400 border border-green-700"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {tag.isActivated ? "✅ Activada" : "⏳ Disponible"}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">URL</p>
                    <a
                      href={tag.qrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-400 hover:text-orange-300 break-all"
                    >
                      {tag.qrUrl}
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handlePrintTag(tag)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all"
                  >
                    🖨️ Imprimir
                  </button>
                  <a
                    href={tag.qrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-center text-gray-300 border border-gray-600 hover:bg-gray-700 transition-all"
                  >
                    👁️ Ver
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden print area */}
      <div ref={printRef} style={{ display: "none" }}></div>
    </div>
  );
};

export default TagGenerator;
