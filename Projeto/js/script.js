function limpar_formulario() {
    document.getElementById("titulo_livro").value = "";
    document.getElementById("genero").value = "";
    document.getElementById("data_publicacao").value = "";
    document.getElementById("avaliacao").value = "";
    document.getElementById("num_avaliacoes").value = "";
    document.getElementById("imagem_capa").src = ""; 
    document.getElementById("preco").value = "";
}

function formatarData(data) {
    const partes = data.split('-'); 
    return `${partes[2]}-${partes[1]}-${partes[0]}`; 
}

function traduzirGenero(genero) {
    const generosTraduzidos = {
        "Fiction": "Ficção",
        "Non-Fiction": "Não Ficção",
        "Fantasy": "Fantasia",
        "Science Fiction": "Ficção Científica",
        "Mystery": "Mistério",
        "Thriller": "Suspense",
        "Romance": "Romance",
        "Biography": "Biografia",
        "History": "História",
        "Children": "Infantil",
        "Philosophy": "Filosofia",
        "Religion": "Religião",
        "Biology": "Biologia",
        "Adventure": "Aventura",
        "Young Adult Fiction": "Ficção Juvenil",
        "Drama": "Drama",
        "Poetry": "Poesia",
        "Self-Help": "Autoajuda",
        "Art": "Arte",
        "Business": "Negócios",
        "Health & Fitness": "Saúde e Fitness",
        "Travel": "Viagem",
        "Cooking": "Culinária",
        "Politics": "Política",
        "Humor": "Humor",
        "Education": "Educação",
        "Psychology": "Psicologia",
        "Technology": "Tecnologia",
        "Computer Science": "Ciência da Computação",
        "Law": "Direito",
        "Economics": "Economia",
        "Sports": "Esportes",
        "Music": "Música",
        "Gardening": "Jardinagem",
        "Comics & Graphic Novels": "Quadrinhos e Novelas Gráficas",
        "Horror": "Terror",
        "Western": "Faroeste",
        "Memoir": "Memórias",
        "Science": "Ciência",
        "True Crime": "Crime Real"
    };
    return generosTraduzidos[genero] || genero; 
}


function pesquisarLivroPorTitulo(titulo) {
    if (titulo.trim() !== "") {

        document.getElementById("genero").value = "...";
        document.getElementById("data_publicacao").value = "...";
        document.getElementById("avaliacao").value = "...";
        document.getElementById("num_avaliacoes").value = "...";
        document.getElementById("imagem_capa").src = ""; 
        document.getElementById("preco").value = ""; 

        var xhr = new XMLHttpRequest();
        var url = 'https://www.googleapis.com/books/v1/volumes?q=intitle:' + encodeURIComponent(titulo);

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.totalItems > 0) {
                        var book = response.items[0].volumeInfo;

                        
                        document.getElementById("genero").value = book.categories ? book.categories.map(traduzirGenero).join(', ') : "Informação não disponível";
                        document.getElementById("data_publicacao").value = book.publishedDate ? formatarData(book.publishedDate) : "Informação não disponível";
                        document.getElementById("avaliacao").value = book.averageRating ? book.averageRating + ' / 5' : "Sem avaliações";
                        document.getElementById("num_avaliacoes").value = book.ratingsCount || "0 avaliações";

                       
                        if (book.imageLinks && book.imageLinks.thumbnail) {
                            document.getElementById("imagem_capa").src = book.imageLinks.thumbnail;
                        } else {
                            document.getElementById("imagem_capa").src = "sem-imagem.png"; 
                        }

                        if (response.items[0].saleInfo && response.items[0].saleInfo.retailPrice) {
                            var precoBRL = response.items[0].saleInfo.retailPrice.amount;
                            var precoBRL2 = precoBRL*12.5125628141;
                            var precoFormatado = (precoBRL2).toFixed(2).replace('.', ','); 
                            document.getElementById("preco").value = "R$"+precoBRL; 
                        } else {
                            document.getElementById("preco").value = "Preço não disponível";
                        }
                    } else {
                        window.alert("Livro não encontrado");
                        limpar_formulario();
                    }
                } else {
                    window.alert("Erro ao buscar dados: " + xhr.status);
                    limpar_formulario();
                }
            }
        };

        xhr.send();
    } else {
        limpar_formulario();
    }
}
