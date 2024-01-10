import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "../avatar";

import imgCurtir from '../../public/imagens/curtir.svg';
import imgCurtido from '../../public/imagens/curtido.svg';
import imgComentarioAtivo from '../../public/imagens/comentarioAtivo.svg';
import imgComentarioCinza from '../../public/imagens/comentarioCinza.svg';
import { FazerComentario } from "./FazerComentario";
import FeedService from "../../services/FeedService";

const tamanhoLimiteDescricao = 90;
const feedService = new FeedService();

export default function Reels({
    id,
    usuario,
    videoDoReel,
    descricao,
    comentarios,
    usuarioLogado,
    curtidas
}) {
    const [curtidasReels, setCurtidasReels] = useState(curtidas);
    const [comentariosReels, setComentariosReels] = useState(comentarios);
    const [deveExibirSecaoParaComentar, setDeveExibirSecaoParaComentar] = useState(false);
    const [tamanhoAtualDaDescricao, setTamanhoAtualDaDescricao] = useState(
        tamanhoLimiteDescricao
    );

    const exibirDescricaoCompleta = () => {
        setTamanhoAtualDaDescricao(Number.MAX_SAFE_INTEGER);
    }

    const descricaoMaiorQueLimite = () => {
        return descricao.length > tamanhoAtualDaDescricao;
    }

    const obterDescricao = () => {
        let mensagem = descricao.substring(0, tamanhoAtualDaDescricao);
        if (descricaoMaiorQueLimite()) {
            mensagem += '...';
        }

        return mensagem;
    }

    const obterImagemComentario = () => {
        return deveExibirSecaoParaComentar
            ? imgComentarioAtivo
            : imgComentarioCinza;
    }

    const comentar = async (comentario) => {
        try {
            await feedService.adicionarComentario(id, comentario);
            setDeveExibirSecaoParaComentar(false);
            setComentariosReels([
                ...comentariosReels,
                {
                    nome: usuarioLogado.nome,
                    mensagem: comentario
                }
            ]);
        } catch (e) {
            alert(`Erro ao fazer comentário! ` + (e?.response?.data?.erro || ''));
        }
    }

    const usuarioLogadoCurtiuReels = () => {
        return curtidasReels.includes(usuarioLogado.id);
    }

    const alterarCurtida = async () => {
        try {
            await feedService.alterarCurtida(id);
            if (usuarioLogadoCurtiuReels()) {
                // Remove o usuário logado da lista de curtidas
                setCurtidasReels(
                    curtidasReels.filter(idUsuarioQueCurtiu => idUsuarioQueCurtiu !== usuarioLogado.id)
                );
            } else {
                // Adiciona o usuário logado na lista de curtidas
                setCurtidasReels([
                    ...curtidasReels,
                    usuarioLogado.id
                ]);
            }
        } catch (e) {
            alert(`Erro ao alterar a curtida! ` + (e?.response?.data?.erro || ''));
        }
    }

    const obterImagemCurtida = () => {
        return usuarioLogadoCurtiuReels()
            ? imgCurtido
            : imgCurtir;
    }

    return (
        <div className="reels">
            <Link href={`/perfil/${usuario.id}`}>
                <section className="cabecalhoReels">
                    <Avatar src={usuario.avatar} />
                    <strong>{usuario.nome}</strong>
                </section>
            </Link>

            <div className="videoDoReels">
                {/* Aqui você precisa utilizar a tag <video> para exibir o vídeo */}
                <video controls width="100%" height="auto">
                    <source src={videoDoReel} type="video/mp4" />
                    Seu navegador não suporta o elemento de vídeo.
                </video>
            </div>

            <div className="rodapeDoReels">
                <div className="acoesDoReels">
                    <Image
                        src={obterImagemCurtida()}
                        alt='ícone curtir'
                        width={20}
                        height={20}
                        onClick={alterarCurtida}
                    />

                    <Image
                        src={obterImagemComentario()}
                        alt='ícone comentar'
                        width={20}
                        height={20}
                        onClick={() => setDeveExibirSecaoParaComentar(!deveExibirSecaoParaComentar)}
                    />

                    <span className="quantidadeCurtidasReels">
                        Curtido por <strong> {curtidasReels.length} pessoas</strong>
                    </span>
                </div>

                <div className="descricaoDoReels">
                    <strong className="nomeUsuario">{usuario.nome}</strong>
                    <p className="descricao">
                        {obterDescricao()}
                        {descricaoMaiorQueLimite() && (
                            <span
                                onClick={exibirDescricaoCompleta}
                                className="exibirDescricaoCompleta">
                                mais
                            </span>
                        )}
                    </p>
                </div>

                <div className="comentariosDoReels">
                    {comentariosReels.map((comentario, i) => (
                        <div className="comentario" key={i}>
                            <strong className="nomeUsuario">{comentario.nome}</strong>
                            <p className="descricao">{comentario.mensagem}</p>
                        </div>
                    ))}
                </div>
            </div>

            {deveExibirSecaoParaComentar &&
                <FazerComentario comentar={comentar} usuarioLogado={usuarioLogado} />
            }
        </div>
    );
}