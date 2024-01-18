import { useState } from "react";
import { useRouter } from 'next/router';
import Botao from "../../componentes/botao";
import CabecalhoComAcoes from "../../componentes/cabecalhoComAcoes";
import UploadArquivo from "../../componentes/uploadArquivo";
import comAutorizacao from "../../hoc/comAutorizacao";
import imagemPublicacao from '../../public/imagens/imagemPublicacao.svg';
import imagemSetaEsquerda from '../../public/imagens/setaEsquerda.svg';
import FeedService from "../../services/FeedService";

const limiteDaDescricao = 255;
const descricaoMinima = 3;
const feedService = new FeedService();

function Publicacao() {
    const [arquivo, setArquivo] = useState();
    const [descricao, setDescricao] = useState('');
    const [inputArquivo, setInputArquivo] = useState();
    const [etapaAtual, setEtapaAtual] = useState(1);
    const router = useRouter();

    const estaNaEtapaUm = () => etapaAtual === 1;

    const obterTextoEsquerdaCabecalho = () => {
        if (estaNaEtapaUm() && arquivo) {
            return 'Cancelar';
        }
        return '';
    }

    const obterTextoDireitaCabecalho = () => {
        if (!arquivo) {
            return '';
        }
        if (estaNaEtapaUm()) {
            return 'Avançar';
        }
        return 'Compartilhar';
    }

    const aoClicarAcaoEsquerdaCabecalho = () => {
        if (estaNaEtapaUm()) {
            inputArquivo.value = null;
            setArquivo(null);
            return;
        }
        setEtapaAtual(1);
    }

    const aoClicarAcaoDireitaCabecalho = () => {
        if (estaNaEtapaUm()) {
            setEtapaAtual(2);
            return;
        }
        publicar();
    }

    const escreverDescricao = (e) => {
        const valorAtual = e.target.value;
        if (valorAtual.length >= limiteDaDescricao) {
            return;
        }
        setDescricao(valorAtual);
    }

    const obterClassNameCabecalho = () => {
        if (estaNaEtapaUm()) {
            return 'primeiraEtapa';
        }
        return 'segundaEtapa';
    }

    const publicar = async () => {
        try {
            if (!validarFormulario()) {
                alert('A descrição precisa ter pelo menos 3 caracteres e uma imagem ou vídeo precisa estar selecionado.');
                return;
            }

            const corpoPublicacao = new FormData();
            corpoPublicacao.append('descricao', descricao);
            corpoPublicacao.append('file', arquivo.arquivo);

            const tipoArquivo = arquivo.isVideo ? 'video' : 'imagem'; 

    
            await feedService.fazerPublicacao(corpoPublicacao, tipoArquivo);

            router.push('/');
        } catch (error) {
            alert('Erro ao salvar publicação!');
        }
    }

    const validarFormulario = () => {
        return (
            descricao.length >= descricaoMinima
            && arquivo?.arquivo
        );
    }

    return (
        <div className="paginaPublicacao largura30pctDesktop">
            <CabecalhoComAcoes
                className={obterClassNameCabecalho()}
                setaEquerda={estaNaEtapaUm() ? null : imagemSetaEsquerda}
                textoEsquerda={obterTextoEsquerdaCabecalho()}
                aoClicarAcaoEsquerda={aoClicarAcaoEsquerdaCabecalho}
                elementoDireita={obterTextoDireitaCabecalho()}
                aoClicarElementoDireita={aoClicarAcaoDireitaCabecalho}
                titulo='Nova publicação'
            />
            <hr className='linhaDivisoria' />
            <div className="conteudoPaginaPublicacao">
                {estaNaEtapaUm() ? (
                    <div className="primeiraEtapa">
                        <UploadArquivo
                            setArquivo={setArquivo}
                            aoSetarAReferencia={setInputArquivo}
                            arquivoPreviewClassName={!arquivo ? 'previewArquivoPublicacao' : 'previewArquivoSelecionada'}
                            arquivoPreview={arquivo?.preview || imagemPublicacao.src}
                        />
                        {arquivo?.isVideo && (
                            <video width="100%" height="auto" controls>
                                <source src={arquivo?.preview} type="video/mp4" />
                                Seu navegador não suporta a tag de vídeo.
                            </video>
                        )}
                        <span className="desktop textoDragAndDrop">Arraste sua foto ou vídeo aqui!</span>
                        <Botao
                            texto='Selecionar uma imagem ou vídeo'
                            manipularClique={() => inputArquivo?.click()}
                        />
                    </div>
                ) : (
                    <>
                        <div className="segundaEtapa">
                            <UploadArquivo
                                setArquivo={setArquivo}
                                preview={arquivo?.preview}
                            />
                            <textarea
                                rows={3}
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
