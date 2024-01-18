import { useRef, useEffect } from "react";
import fileType from "file-type";

export default function UploadArquivo({
    className = '',
    setArquivo,
    preview,
    previewClassName = '',
    aoSetarAReferencia,
    tiposAceitos = "image/*,video/*"
}) {
    const referenciaInput = useRef(null);

    useEffect(() => {
        if (!aoSetarAReferencia) {
            return;
        }

        aoSetarAReferencia(referenciaInput?.current);
    }, [aoSetarAReferencia, referenciaInput]);

    const abrirSeletorArquivos = () => {
        referenciaInput?.current?.click();
    }

    const aoAlterarArquivo = async () => {
        if (!referenciaInput?.current?.files?.length) {
            return;
        }

        const arquivo = referenciaInput?.current?.files[0];
        await obterUrlDoArquivoEAtualizarEstado(arquivo);
    }

    const obterUrlDoArquivoEAtualizarEstado = async (arquivo) => {
        const tipoArquivo = await verificarTipoArquivo(arquivo);

        if (tipoArquivo === 'image') {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(arquivo);
            fileReader.onloadend = () => {
                setArquivo({
                    preview: fileReader.result,
                    arquivo
                });
            }
        } else if (tipoArquivo === 'video') {
            const previewUrl = URL.createObjectURL(arquivo);
            setArquivo({
                preview: previewUrl,
                arquivo
            });
        }
    }

    const verificarTipoArquivo = async (arquivo) => {
        const buffer = await readAsArrayBuffer(arquivo);
        const tipoMime = await fileType.fromBuffer(buffer);

        if (tipoMime) {
            return tipoMime.mime.split('/')[0]; // 'image' ou 'video'
        }

        // Se não foi possível determinar o tipo, assume um tipo genérico
        return 'unknown';
    }

    const readAsArrayBuffer = (arquivo) => {
        return new Promise((resolve) => {
            const leitor = new FileReader();
            leitor.onloadend = () => {
                resolve(leitor.result);
            };
            leitor.readAsArrayBuffer(arquivo);
        });
    }

    const aoSoltarArquivo = async (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const arquivo = e.dataTransfer.files[0];
            await obterUrlDoArquivoEAtualizarEstado(arquivo);
        }
    }

    return (
        <div className={`uploadArquivoContainer ${className}`}
            onClick={abrirSeletorArquivos}
            onDragOver={e => e.preventDefault()}
            onDrop={aoSoltarArquivo}
        >
            {preview && (
                <div className="previewContainer">
                    {preview.startsWith('data:image/') && (
                        <img 
                            src={preview}
                            alt='Preview do arquivo'
                            className={previewClassName}
                        />
                    )}
                    {preview.startsWith('data:video/') && (
                        <video 
                            src={preview}
                            controls
                            className={previewClassName}
                        />
                    )}
                </div>
            )}

            <input
                type='file'
                className='oculto'
                accept={tiposAceitos}
                ref={referenciaInput}
                onChange={aoAlterarArquivo}
            />
        </div>
    );
}
