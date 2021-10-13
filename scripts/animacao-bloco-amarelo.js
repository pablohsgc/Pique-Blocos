const div_bloco_amarelo = document.querySelector("#bloco-amarelo-1");

//Objeto que representa a Area do Game que os blocos podem se mover
const AreaAnimacao = {
    largura:100,
    altura:100,
};


class Ponto{
    constructor(posicao_x=0,posicao_y=0,tamanho=1){
        this.posicao_x = posicao_x;
        this.posicao_y = posicao_y;
        this.tamanho = tamanho;
    }

    nova_coordenada(){
        this.posicao_y = Math.floor(Math.random() * (AreaAnimacao.altura - this.tamanho));
        this.posicao_x = Math.floor(Math.random() * (AreaAnimacao.largura - this.tamanho));
    }
}

ponto = new Ponto(0,0,10);

var animacao = setInterval(() => {
    ponto.nova_coordenada();
    div_bloco_amarelo.style.margin = `${ponto.posicao_x}px ${ponto.posicao_y}px`;
},1000);

