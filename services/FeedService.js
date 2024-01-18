import DevagramApiService from "./DevagramApiService";

export default class FeedService extends DevagramApiService {
    
    // Carrega postagens de um usuário ou de todos os usuários se nenhum id for fornecido.
    async carregarPostagens(idUsuario) {
        let url = '/feed';
        if (idUsuario) {
            url += `?id=${idUsuario}`;
        }

        return this.get(url);
    }

    // Adiciona um comentário em uma postagem específica.
    async adicionarComentario(idPostagem, comentario) {
        return this.put(`/comentario?id=${idPostagem}`, {
            comentario
        });
    }

    // Altera o estado da curtida em uma postagem específica.
    async alterarCurtida(idPostagem) {
        return this.put(`/like?id=${idPostagem}`);
    }

    // Faz uma nova publicação no feed.
    async fazerPublicacao(dadosPublicacao) {
        return this.post('/publicacao', dadosPublicacao);
    }

    // Carrega os reels de um usuário.
    async carregarReels(idUsuario) {
        let url = '/reels';
        if (idUsuario) {
            url += `?id=${idUsuario}`;
        }

        return this.get(url);
    }

    // Adiciona um novo reel para um usuário.
    async adicionarReel(dadosReel) {
        return this.post('/reels', dadosReel);
    }

    // Substitui um reel existente com novos dados.
    async substituirReel(idReel, dadosReel) {
        return this.put(`/reels/${idReel}`, dadosReel);
    }

    // Deleta um reel existente.
    async deletarReel(idReel) {
        return this.delete(`/reels/${idReel}`);
    }
}