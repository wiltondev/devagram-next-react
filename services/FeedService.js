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


    async fazerPublicacao(dadosPublicacao, tipoArquivo = 'imagem') {
        const rota = this.obterRotaPublicacao(tipoArquivo);
        return this.post(rota, dadosPublicacao);
    }

    obterRotaPublicacao(tipoArquivo) {
        return tipoArquivo === 'video' ? '/reels' : '/publicacao';
    }



}