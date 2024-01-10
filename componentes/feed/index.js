import { useState, useEffect } from "react";
import FeedService from "../../services/FeedService";
import Postagem from "./Postagem";
import Reels from "./Reels"; 

const feedService = new FeedService();

export default function Feed({ usuarioLogado, usuarioPerfil }) {
    const [listaDePostagens, setListaDePostagens] = useState([]);
    const [listaDeReels, setListaDeReels] = useState([]);
    const [exibirPostagens, setExibirPostagens] = useState(true); // Novo estado para controlar a exibição de postagens ou reels.

    useEffect(() => {
        async function fetchData() {
            setListaDePostagens([]);
            setListaDeReels([]);

            if (exibirPostagens) {
                // Carrega e formata os dados das postagens.
                const postagensResponse = await feedService.carregarPostagens(usuarioPerfil?._id);
                const postagensFormatadas = postagensResponse.data.map((postagem) => ({
                    id: postagem._id,
                    usuario: {
                        id: postagem.userId,
                        nome: postagem?.usuario?.nome || usuarioPerfil?.nome,
                        avatar: postagem?.usuario?.avatar || usuarioPerfil?.avatar
                    },
                    fotoDoPost: postagem.foto,
                    descricao: postagem.descricao,
                    curtidas: postagem.likes,
                    comentarios: postagem.comentarios.map((c) => ({
                        nome: c.nome,
                        mensagem: c.comentario
                    }))
                }));

                setListaDePostagens(postagensFormatadas);
            } else {
                // Carrega e formata os dados dos reels.
                const reelsResponse = await feedService.carregarReels(usuarioPerfil?._id);
                const reelsFormatados = reelsResponse.data.map((reel) => ({
                    id: reel._id,
                    usuario: {
                        id: reel.userId,
                        nome: reel?.usuario?.nome || usuarioPerfil?.nome,
                        avatar: reel?.usuario?.avatar || usuarioPerfil?.avatar
                    },
                    videoDoReel: reel.video, // Supondo que há uma propriedade 'video' no objeto reel.
                    descricao: reel.descricao,
                    curtidas: reel.likes,
                    comentarios: reel.comentarios.map((comentario) => ({
                        nome: comentario.nome,
                        mensagem: comentario.comentario
                    }))
                }));

                setListaDeReels(reelsFormatados);
            }
        }

        // Executa a função fetchData sempre que as dependências (usuarioLogado, usuarioPerfil ou exibirPostagens) mudam.
        fetchData();
    }, [usuarioLogado, usuarioPerfil, exibirPostagens]);

    const alternarExibicao = () => {
        // Alterna entre a exibição de postagens e reels.
        setExibirPostagens((prev) => !prev);
    };

    if (!exibirPostagens && !listaDeReels.length) {
        return null; // Se não houver reels e estiver configurado para exibi-los, retorna null.
    }

    return (
        <div className="feedContainer largura30pctDesktop">
            {/* Botão para alternar entre exibição de postagens e reels */}
            <button onClick={alternarExibicao} className="toggleButton">
                {exibirPostagens ? "Exibir Reels" : "Exibir Postagens"}
            </button>

            {/* Renderiza a lista de postagens ou reels com base no estado 'exibirPostagens' */}
            {exibirPostagens ? (
                listaDePostagens.map((dadosPostagem) => (
                    <Postagem
                        key={dadosPostagem.id}
                        {...dadosPostagem}
                        usuarioLogado={usuarioLogado}
                    />
                ))
            ) : (
                <Reels listaDeReels={listaDeReels} />
            )}
        </div>
    );
}
