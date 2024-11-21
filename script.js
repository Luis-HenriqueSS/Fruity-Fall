const crianca = document.getElementById('crianca')
let pontuacaoTexto = document.getElementById("pontos")
let posicaoCrianca = window.innerWidth / 2 //DEFINE O JOGADOR PARA O MEIO DA TELA HORIZONTALMENTE
let movimento = 15 //MOVIMENTO DO JOGADOR
let intervaloDecaimento = 60 //INTERVALO DE TEMPO INICIAL NA EXECUÇÃO DO CODIGO DE DECAIMENTO
let intervaloCriacaoFruta = 2500 //INTERVALO DE TEMPO INICIAL NA CRIAÇÃO DAS FRUTAS
let pontuacao = 0 //PONTUAÇÃO INICIAL DO JOGADOR

//COMANDOS DE MOVIMENTAÇÂO DO JOGADOR
document.addEventListener('keydown', function(event) {

    if (event.key === 'a' || event.key === 'A') {
        crianca.style.transform = "scaleX(-1)" //ESPELHA A ANIMAÇÃO DA CRIANÇA
        posicaoCrianca -= movimento
        if (posicaoCrianca < 0) {
            posicaoCrianca = 0
        }

    } else if (event.key === 'd' || event.key === 'D') {
        crianca.style.transform = "scaleX(1)" //VOLTA A ANIMAÇÃO DA CRIANÇA
        posicaoCrianca += movimento
        if (posicaoCrianca > window.innerWidth - 50) {
            posicaoCrianca = window.innerWidth - 50
        }
    }
    crianca.style.left = posicaoCrianca + 'px'
})

//CRIAÇÃO DAS ARMADILHAS
function criarArmadilha() {
    let nascimentoArmadilha = Math.random() * (window.innerWidth - 100) //IMPEDIR QUE A ARMADILHA PASSE A DIREITA DA TELA
    //CRIA A DIV
    const armadilha = document.createElement("div")
    //DEFINE A DIV COM A CLASSE ARMADILHA DO CSS
    armadilha.classList.add("armadilha")
    //DEFINE O PONTO DE NASCIMENTO ALEATORIO DA ARMADILHA
    armadilha.style.left = nascimentoArmadilha + 'px'
    //FAZ A DIV FRUTA APARECER NA TELA APOS SUAS DEVIDAS "CONFIGURAÇÕES" ANTERIORES
    document.body.appendChild(armadilha)

    //DECAIMENTO DA ARMADILHA NA TELA
    let posicaoArmadilha = 0 //POSIÇÃO DA ARMADILHA NO TOPO DA TELA
    const fallInterval = setInterval(() => {
        posicaoArmadilha += 5
        armadilha.style.top = posicaoArmadilha + 'px'

        //COLISÃO DA ARMADILHA COM O JOGADOR
        if (colisaoDetectada(armadilha, crianca)) {
            clearInterval(fallInterval)
            document.body.removeChild(armadilha) //REMOVE A FRUTA QUANDO COLIDE
            pontuacao = 0 //PENALIDADE REINICIANDO O JOGO
            pontuacaoTexto.innerText = `Pontos: ${pontuacao}`
        }
        //REMOVE A ARMADILHA AO PASSAR A TELA
        if (posicaoArmadilha > window.innerHeight) {
            clearInterval(fallInterval)
            document.body.removeChild(armadilha) //REMOVE A FRUTA QUANDO PASSA
        }
    }, intervaloDecaimento) //INTERVALO DE TEMPO NA EXECUÇÃO DO CODIGO DE DECAIMENTO
}

//CRIAÇÃO DAS FRUTAS
function criarFruta() {
    //DEFINE O PONTO DE NASCIMENTO ALEATORIO DA FRUTA
    let nascimentoFruta = Math.random() * (window.innerWidth - 68) //IMPEDIR QUE A FRUTA PASSE A DIREITA DA TELA

    if (pontuacao > 200) {
        let tipoDeFruta = Math.random() * 10 + 1
        if (tipoDeFruta > 8) {
            criarArmadilha()
            return
        }
    }
    //CRIA A DIV
    const fruta = document.createElement("div")
    //DEFINE A DIV COM A CLASSE FRUTA DO CSS
    fruta.classList.add("fruta")
    //DEFINE O PONTO DE NASCIMENTO ALEATORIO DA FRUTA
    fruta.style.left = nascimentoFruta + 'px'


    //DEFINE A IMAGEM DA FRUTA ALEATORIAMENTE
    let frutaRandom = Math.floor(Math.random() * 3) + 1
    if (frutaRandom === 1) {
        fruta.style.backgroundImage = "url('Orange.png')"
    } else if (frutaRandom === 2) {
        fruta.style.backgroundImage = "url('Grape.png')"
    } else if (frutaRandom === 3) {
        fruta.style.backgroundImage = "url('Cherry.png')"
    }

    //FAZ A DIV FRUTA APARECER NA TELA APOS SUAS DEVIDAS "CONFIGURAÇÕES" ANTERIORES
    document.body.appendChild(fruta)

    //DECAIMENTO DA FRUTA NA TELA
    let posicaoFruta = 0 //POSIÇÃO DA FRUTA NO TOPO DA TELA
    const fallInterval = setInterval(() => {
    posicaoFruta += 5
    fruta.style.top = posicaoFruta + 'px'

    //COLISÃO DA FRUTA COM O JOGADOR
    if (colisaoDetectada(fruta, crianca)) {
        clearInterval(fallInterval)
        document.body.removeChild(fruta) //REMOVE A FRUTA QUANDO COLIDE
        
        //ATUALIZA O NOVO VALOR DOS PONTOS
        pontuacao += 5 //VALOR GERAL DOS PONTOS
        pontuacaoTexto.innerText = `Pontos: ${pontuacao}`
    }        

    //REMOVE A FRUTA AO PASSAR A TELA E PENALIZA O JOGADOR
    if (posicaoFruta > window.innerHeight) {
        clearInterval(fallInterval)
        document.body.removeChild(fruta) //REMOVE A FRUTA QUANDO PASSA
        if (pontuacao <= 10) {
            pontuacao = 0 //IMPEDIR QUE A PONTUAÇÃO FIQUE NEGATIVA
        } else {
            pontuacao -= 10 //PENALIDADE DIMINUINDO OS PONTOS
        }
        pontuacaoTexto.innerText = `Pontos: ${pontuacao}` //ATUALIZAÇÃO DOS PONTOS
    }
    }, intervaloDecaimento) //INTERVALO DE TEMPO NA EXECUÇÃO DO CODIGO DE DECAIMENTO
}

setInterval(criarFruta, intervaloCriacaoFruta) //INTERVALO DE TEMPO NA CRIAÇÃO DAS FRUTAS

//COMPARAR SE OS OBJETOS FORAM COLIDIDOS COM O JOGADOR
function colisaoDetectada(objeto, crianca) {
    const objetoColisao = objeto.getBoundingClientRect()
    const criancaColisao = crianca.getBoundingClientRect()

    if (objetoColisao.top > criancaColisao.bottom) {
        return false // O primeiro elemento está completamente acima do segundo
    }
    if (objetoColisao.bottom < criancaColisao.top) {
        return false // O primeiro elemento está completamente abaixo do segundo
    }
    if (objetoColisao.left > criancaColisao.right) {
        return false // O primeiro elemento está completamente à direita do segundo
    }
    if (objetoColisao.right < criancaColisao.left) {
        return false // O primeiro elemento está completamente à esquerda do segundo
    }

    return true // Se nenhuma das condições acima for verdadeira, os elementos estão se sobrepondo
}

let intervaloFrutaID
//ATUALIZA OS INTERVALOS ASSIM AUMENTANDO A DIFICULDADE
function reiniciarIntervaloFruta() {
    if (intervaloFrutaID) {
        clearInterval(intervaloFrutaID) //LIMPA OS INTERVALOS ANTERIORES
    }

    intervaloFrutaID = setInterval(criarFruta, intervaloCriacaoFruta) //RESTAURA OS INTERVALOS PARA OS VALORES ATUALIZADOS
}

//MENSAGEM PARA O JOGADOR AO PASSAR DE FASE
function mostrarAmazing() {
    amazing.style.visibility = "visible"

    setTimeout(() => {
        amazing.style.visibility = "hidden"
    }, 2000)
}

let fase = document.getElementById("fase")
//PONTUAÇÃO NECESSARIA PARA MUDANÇAS NA DIFICULDADE DE CADA FASE
let amazing = document.getElementById("amazing")
function atualizarFases() {

    if (pontuacao == 0) {
        intervaloDecaimento = 60
        intervaloCriacaoFruta = 2500
        fase.innerText = `Fase: 1`

    } else if (pontuacao == 100) {
        intervaloDecaimento = 60
        intervaloCriacaoFruta = 2000
        fase.innerText = `Fase: 2`
        mostrarAmazing()

    } else if (pontuacao == 200) {
        intervaloDecaimento = 50
        intervaloCriacaoFruta = 2000
        fase.innerText = `Fase: 3`
        mostrarAmazing()

    } else if (pontuacao == 300) {
        intervaloDecaimento = 40
        intervaloCriacaoFruta = 2000
        fase.innerText = `Fase: 4`
        mostrarAmazing()

    } else if (pontuacao == 400) {
        intervaloDecaimento = 40
        intervaloCriacaoFruta = 1500
        fase.innerText = `Fase: 5`
        mostrarAmazing()

    } else if (pontuacao == 500) {
        intervaloDecaimento = 30
        intervaloCriacaoFruta = 1500
        fase.innerText = `Fase: 6`
        mostrarAmazing()

    } else if (pontuacao >= 600) {
        fase.innerText = `Fase: ????`
        pontuacaoTexto.innerText = `Pontos: ????`
        alert('"Seu cachorro não morreu, deixe-me mostrar onde ele está" \nFIM.')
        //TERMINA O JOGO
    }

    reiniciarIntervaloFruta() //ATUALIZA OS INTERVALOS ASSIM AUMENTANDO A DIFICULDADE
}
setInterval(atualizarFases, 50)