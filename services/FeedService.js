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
        const isImagem = dadosPublicacao.get('file').type.startsWith('image');
        const rota = isImagem ? '/publicacao' : '/reels';

        try {
            const response = await this.post(rota, dadosPublicacao);

            if (response.status === 200) {
                // Lógica de tratamento bem-sucedido
                console.log(`Publicação feita com sucesso: ${rota}`);
            } else {
                // Lógica de tratamento de erro
                console.error(`Erro ao fazer publicação: ${response.statusText}`);
            }
        } catch (error) {
            // Lógica de tratamento de erro
            console.error('Erro ao fazer publicação:', error);
            throw error;
        }
    }
}        
