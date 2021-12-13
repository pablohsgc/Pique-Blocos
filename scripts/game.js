const div_bloco_azul = document.querySelector(".blocoAzul");
const div_bloco_vermelho = document.querySelector(".blocoVermelho");
const div_ponto = document.querySelector(".ponto");
const elemento_pontuacao = document.querySelector("#pontuacao");
const areaGame = document.querySelector(".area-navegacao");
var audio = new Audio('./audios/salamisound-6039631-sfx-power-up-25-games.mp3');
//Audio de https://www.salamisound.com/pt/6039631-sfx-powerup-25-jogos-jogo 

var pontuacao = 0;

function atualiza_pontuacao(){
    pontuacao += 1;
    elemento_pontuacao.innerHTML = "Pontuação: " + pontuacao;
}

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
    largura:600, // tamanho da area menos o tamanho do bloco
    altura:600,
    limites_navegavao:limites_navegavao
};


class Ponto{
    constructor(posicao_x=0,posicao_y=0,tamanho=1){
        this.posicao_x = posicao_x;
        this.posicao_y = posicao_y;
        this.tamanho = tamanho;
    }

    nova_coordenada(){
        this.posicao_y = Math.floor(Math.random() * (AreaGame.altura - this.tamanho));
        this.posicao_x = Math.floor(Math.random() * (AreaGame.largura - this.tamanho));
    }
}


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
}


//Tamanho pode ser adicionado em bloco para se calcular colisao
class BlocoRival extends Bloco{
    constructor(posicao_x=0,posicao_y=0,velocidade=1,tamanho=20){
        super(posicao_x,posicao_y,velocidade,tamanho);
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

    aumenta_tamanho(){
        this.tamanho += 1;
    }
}

const gera_novo_ponto = () => {
    ponto_amarelo.nova_coordenada();
    div_ponto.style.margin = `${ponto_amarelo.posicao_y}px ${ponto_amarelo.posicao_x}px`;
};


const bloco = new Bloco(0,0,5,20);
const blocoRival = new BlocoRival(580,580,5,20);
const ponto_amarelo = new Ponto(0,0,20);
gera_novo_ponto();


const aumenta_nivel = () => {
    atualiza_pontuacao();
    bloco.velocidade += 1;
    blocoRival.aumenta_tamanho();
    gera_novo_ponto();
    
    if(pontuacao % 10 == 0){
        ponto_amarelo.tamanho += 5;
        div_ponto.style.width = ponto_amarelo.tamanho + "px";
        div_ponto.style.height = ponto_amarelo.tamanho + "px"; 
    }
}

//Funcao de animacao ao usuario escolher uma tecla
function animate(tecla){
    if(tecla == "ArrowUp"){
        bloco.movimenta_cima();
    }else if(tecla == "ArrowDown"){
        bloco.movimenta_baixo();
    }else if(tecla == "ArrowLeft"){
        bloco.movimenta_esquerda();
    }else if(tecla == "ArrowRight"){
        bloco.movimenta_direita();
    }

    div_bloco_azul.style.margin = `${bloco.posicao_y}px ${bloco.posicao_x}px`;
    
    if(bloco.capturou_bloco(ponto_amarelo.posicao_x,ponto_amarelo.posicao_y,ponto_amarelo.tamanho)){
        audio.play();
        aumenta_nivel();
    }
}


//Adicionando uma funcao que sera executada enquanto cada tecla for precionada
window.onkeydown = (e) => {
    animate(e.key);
}


//Chamada da funcao persegue bloco
let persequicao = setInterval(() => {
    blocoRival.persegue_bloco(bloco.posicao_x,bloco.posicao_y);
    
    div_bloco_vermelho.style.width = blocoRival.tamanho+"px";
    div_bloco_vermelho.style.height = blocoRival.tamanho+"px";
    div_bloco_vermelho.style.margin = `${blocoRival.posicao_y}px ${blocoRival.posicao_x}px`;

    if(blocoRival.capturou_bloco(bloco.posicao_x,bloco.posicao_y,bloco.tamanho)){
        game_over();    
    }
},200);


function recarrega_pagina(){
    window.location.href = "./game.html";
}

const game_over = () => {
    clearInterval(persequicao);
    window.onkeydown = null;
    elemento_pontuacao.innerHTML = "Fim de jogo, você fez "+pontuacao+" pontos.";
    areaGame.innerHTML = areaGame.innerHTML + "<button id='btn-reiniciar' onclick=recarrega_pagina()>Nova partida</button>";
}