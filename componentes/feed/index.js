import { useState, useEffect } from "react";
import FeedService from "../../services/FeedService";
import Postagem from "./Postagem";

const feedService = new FeedService();

export default function Feed({ usuarioLogado, usuarioPerfil }) {
    const [listaDePostagens, setListaDePostagens] = useState([]);

    useEffect(() => {
        const carregarPostagens = async () => {
            try {
                const { data } = await feedService.carregarPostagens(usuarioPerfil?._id);

                const postagensFormatadas = data.map((postagem) => ({
                    id: postagem._id,
                    usuario: {
                        id: postagem.userId,
                        nome: postagem?.usuario?.nome || usuarioPerfil?.nome,
                        avatar: postagem?.usuario?.avatar || usuarioPerfil?.avatar,
                    },
                    fotoDoPost: postagem.foto,
                    descricao: postagem.descricao,
                    curtidas: postagem.likes,
                    comentarios: postagem.comentarios.map((c) => ({
                        nome: c.nome,
                        mensagem: c.comentario,
                    })),
                    isVideo: postagem.isVideo || false,
                    videoUrl: postagem.url || "", // Adicione esta propriedade e forneça um URL padrão caso não seja um vídeo
                }));

                setListaDePostagens(postagensFormatadas);
            } catch (error) {
                console.error("Erro ao carregar postagens:", error);
            }
        };

        carregarPostagens();
    }, [usuarioPerfil]);

    if (!listaDePostagens.length) {
        return null;
    }

    return (
        <div className="feedContainer largura30pctDesktop">
            {listaDePostagens.map((dadosPostagem) => (
                <Postagem
                    key={dadosPostagem.id}
                    {...dadosPostagem}
                    usuarioLogado={usuarioLogado}
                />
            ))}
        </div>
    );
}
