//Objeto com funcoes para calcular o limite que um bloco pode se locomover.
const limites_navegavao = {
    ver_sup: (velocidade,tamanho) => {
        return velocidade;
    },
    ver_inf: (velocidade,tamanho) => {
        return AreaGame.altura-velocidade-tamanho;
    },
    hor_esq: (velocidade,tamanho) => {
        return velocidade;
    },
    hor_dir: (velocidade,tamanho) => {
        return AreaGame.largura-velocidade-tamanho;
    }
};

//Objeto que representa a Area do Game que os blocos podem se mover
const AreaGame = {
    largura:100, // tamanho da area menos o tamanho do bloco
    altura:100,
    limites_navegavao:limites_navegavao
};

//Classe para representar o comportamento de um bloco
class Bloco{
    constructor(posicao_x=0,posicao_y=0,velocidade=1,tamanho=1){
        this.posicao_x = posicao_x;
        this.posicao_y = posicao_y;
        this.velocidade = velocidade;
        this.tamanho = tamanho;
    }
    
    movimenta_esquerda(){
        if(this.posicao_x >= AreaGame.limites_navegavao.hor_esq(this.velocidade,this.tamanho))
            this.posicao_x -= this.velocidade;
        else
            this.posicao_x = 0;
    }

    movimenta_direita(){
        if(this.posicao_x <= AreaGame.limites_navegavao.hor_dir(this.velocidade,this.tamanho))
            this.posicao_x += this.velocidade;
        else
            this.posicao_x = AreaGame.largura - this.tamanho;
    }

    movimenta_cima(){
        if(this.posicao_y >= AreaGame.limites_navegavao.ver_sup(this.velocidade,this.tamanho))
            this.posicao_y -= this.velocidade;
        else
            this.posicao_y = 0;
    }

    movimenta_baixo(){
        if(this.posicao_y <= AreaGame.limites_navegavao.ver_inf(this.velocidade,this.tamanho))
            this.posicao_y += this.velocidade;
        else
            this.posicao_y = AreaGame.altura - this.tamanho;
    }

    capturou_bloco(eixo_x,eixo_y,tamanho){
        if( ((eixo_x <= this.posicao_x && eixo_x + tamanho >= this.posicao_x) ||
            (eixo_x >= this.posicao_x && eixo_x <= this.posicao_x + this.tamanho)) &&
            ((eixo_y >= this.posicao_y && eixo_y <= this.posicao_y + this.tamanho) ||
            ((eixo_y <= this.posicao_y && eixo_y + tamanho >= this.posicao_y)))
        )
            return true;
        return false;
    }

    persegue_bloco(eixo_x,eixo_y){
        if(this.posicao_x > eixo_x)
            this.movimenta_esquerda();
        if(this.posicao_x < eixo_x)
            this.movimenta_direita();
        if(this.posicao_y > eixo_y)
            this.movimenta_cima();
        if(this.posicao_y < eixo_y)
            this.movimenta_baixo();
    }
}

const bloco = new Bloco(0,0,2,10);
const ponto_amarelo = new Ponto(50,50,10);

const div_bloco = document.querySelector("#bloco-azul-2");
const div_ponto = document.querySelector("#bloco-amarelo-2");
div_ponto.style.margin = `${ponto_amarelo.posicao_x}px ${ponto_amarelo.posicao_y}px`;


setInterval(() => {
    bloco.persegue_bloco(ponto_amarelo.posicao_x,ponto_amarelo.posicao_y);
    div_bloco.style.margin = `${bloco.posicao_x}px ${bloco.posicao_y}px`;

    if(bloco.capturou_bloco(ponto_amarelo.posicao_x,ponto_amarelo.posicao_y,ponto_amarelo.tamanho)){
        ponto_amarelo.nova_coordenada();
        setTimeout(()=>{ //atraso para ajustar bloco
            div_ponto.style.margin = `${ponto_amarelo.posicao_x}px ${ponto_amarelo.posicao_y}px`;
        },200);
    }
    
},200);