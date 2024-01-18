import { useRef, useEffect } from "react";

export default function UploadArquivo({
    className = '',
    setArquivo,
    arquivoPreview,
    arquivoPreviewClassName = '',
    aoSetarAReferencia
}) {
    const referenciaInput = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (aoSetarAReferencia) {
            aoSetarAReferencia(referenciaInput.current);
        }
    }, [aoSetarAReferencia]);

    const abrirSeletorArquivos = () => {
        referenciaInput.current.click();
    }

    const aoAlterarArquivo = () => {
        if (referenciaInput.current.files.length > 0) {
            const arquivo = referenciaInput.current.files[0];
            obterUrlDoArquivoEAtualizarEstado(arquivo);
        }
    }

    const obterUrlDoArquivoEAtualizarEstado = (arquivo) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(arquivo);
        fileReader.onloadend = () => {
            setArquivo({
                preview: fileReader.result,
                arquivo
            });
        }
    }

    const aoSoltarOArquivo = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const arquivo = e.dataTransfer.files[0];
            obterUrlDoArquivoEAtualizarEstado(arquivo);
        }
    }

    const capturarThumbnail = () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const thumbnail = canvas.toDataURL("image/jpeg");

        setArquivo((prevArquivo) => ({
            ...prevArquivo,
            preview: thumbnail
        }));
    };

    return (
        <div className={`uploadArquivoContainer ${className}`}
            onClick={abrirSeletorArquivos}
            onDragOver={(e) => e.preventDefault()}
            onDrop={aoSoltarOArquivo}
        >
            {arquivoPreview && (
                <div className="arquivoPreviewContainer">
                    {arquivoPreview.type.startsWith('image/') ? (
                        <img
                            src={arquivoPreview.preview}
                            alt='arquivo preview'
                            className={arquivoPreviewClassName}
                        />
                    ) : (
                        <div>
                            <video
                                width="320"
                                height="240"
                                controls
                                ref={videoRef}
                                onLoadedData={capturarThumbnail}
                            >
                                <source src={arquivoPreview.preview} type={arquivoPreview.type} />
                                Your browser does not support the video tag.
                            </video>

                        </div>
                    )}
                </div>
            )}

            <input
                type='file'
                className='oculto'
                accept="image/*, video/*"
                ref={referenciaInput}
                onChange={aoAlterarArquivo}
            />
        </div>
    );
}
