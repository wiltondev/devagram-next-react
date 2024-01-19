import React, { useState } from "react";
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Botao from "../../componentes/botao";
import CabecalhoComAcoes from "../../componentes/cabecalhoComAcoes";
import comAutorizacao from "../../hoc/comAutorizacao";
import FeedService from "../../services/FeedService";
import UploadArquivo from "../../componentes/uploadArquivo";
import ReactPlayer from 'react-player';

const limiteDaDescricao = 255;
const descricaoMinima = 3;
const feedService = new FeedService();

function Publicacao() {
    const [arquivo, setArquivo] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [etapaAtual, setEtapaAtual] = useState(1);
    const router = useRouter();

    const estaNaEtapaUm = () => etapaAtual === 1;

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*, video/mp4, video/webm, video/ogg',
        onDrop: (acceptedFiles) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                setArquivo({
                    arquivo: acceptedFiles[0],
                    preview: URL.createObjectURL(acceptedFiles[0]),
                    tipo: acceptedFiles[0].type.startsWith('image') ? 'imagem' : 'video'
                });
            }
        }
    });

    const obterTextoEsquerdaCabecalho = () => estaNaEtapaUm() ? 'Cancelar' : '';

    const obterTextoDireitaCabecalho = () => !arquivo ? '' : estaNaEtapaUm() ? 'Avançar' : 'Compartilhar';

    const aoClicarAcaoEsquerdaCabecalho = () => estaNaEtapaUm() ? setArquivo(null) : setEtapaAtual(1);

    const aoClicarAcaoDireitaCabecalho = () => estaNaEtapaUm() ? setEtapaAtual(2) : publicar();

    const escreverDescricao = (e) => {
        const valorAtual = e.target.value;
        if (valorAtual.length < limiteDaDescricao) {
            setDescricao(valorAtual);
        }
    }

    const obterClassNameCabecalho = () => estaNaEtapaUm() ? 'primeiraEtapa' : 'segundaEtapa';

    const publicar = async () => {
        try {
            if (!validarFormulario()) {
                alert('A descrição precisa de pelo menos 3 caracteres e o arquivo precisa estar selecionado.');
                return;
            }

            const corpoPublicacao = new FormData();
            corpoPublicacao.append('descricao', descricao);
            corpoPublicacao.append('file', arquivo.arquivo);

            const rota = arquivo.tipo === 'video' ? '/api/reels' : '/api/publicacao';
            await feedService.fazerPublicacao(corpoPublicacao, rota);
            router.push('/');
        } catch (error) {
            alert('Erro ao salvar publicação!');
        }
    }

    const validarFormulario = () => descricao.length >= descricaoMinima && arquivo?.arquivo;

    return (
        <div className="paginaPublicacao largura30pctDesktop">
            <CabecalhoComAcoes
                className={obterClassNameCabecalho()}
                setaEquerda={estaNaEtapaUm() ? null : <img src="caminho_para_seta_esquerda" alt="Seta Esquerda" />}
                textoEsquerda={obterTextoEsquerdaCabecalho()}
                aoClicarAcaoEsquerda={aoClicarAcaoEsquerdaCabecalho}
                elementoDireita={obterTextoDireitaCabecalho()}
                aoClicarElementoDireita={aoClicarAcaoDireitaCabecalho}
                titulo='Nova publicação'
            />

            <hr className='linhaDivisoria' />

            <div className="conteudoPaginaPublicacao">
                {estaNaEtapaUm() ? (
                    <div className="primeiraEtapa" {...getRootProps()}>
                        <input {...getInputProps()} />
                        {arquivo && arquivo.tipo === 'imagem' && (
                            <img src={arquivo.preview} alt='preview' className='previewImagemSelecionada' />
                        )}
                        {arquivo && arquivo.tipo === 'video' && (
                            <div>
                                <ReactPlayer url={arquivo.preview} controls width="320px" height="240px" />
                            </div>
                        )}
                        {!arquivo && (
                            <>
                                <span className="desktop textoDragAndDrop">Arraste sua foto ou vídeo aqui!</span>
                                <Botao texto='Selecionar um arquivo' manipularClique={() => getInputProps().onClick()} />
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="segundaEtapa">
                            <UploadArquivo
                                arquivo={arquivo}
                                setArquivo={setArquivo}
                                renderPreview={arquivo && arquivo.tipo === 'imagem'}
                            />
                            <textarea
                                rows={5}
                                value={descricao}
                                placeholder='Escreva uma legenda...'
                                onChange={escreverDescricao}
                            ></textarea>
                        </div>
                        <hr className='linhaDivisoria' />
                    </>
                )}
            </div>
        </div>
    );
}

export default comAutorizacao(Publicacao);
