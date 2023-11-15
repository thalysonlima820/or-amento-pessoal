class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for( let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

class Db{
    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    proximoid(){
        let proximoid = localStorage.getItem('id')
        return parseInt(proximoid) + 1
    }

    gravar(d){
        let id = this.proximoid()
        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){

        let despesas = Array();
        let id = localStorage.getItem('id');
        for( let i = 0; i <= id; i++){

            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }

            despesas.push(despesa)
        }
       return despesas
    }
}

let bd = new Db()

function cadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
    );

    if(despesa.validarDados()){
        bd.gravar(despesa)

        document.getElementById('modal_titulo').innerHTML = 'Sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_descricao').innerHTML = 'Despesa foi cadastrada com Sucesso!'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn-success'

        $('#modalRegistraDespesa').modal('show')

        ano.value = ''
        mes.value = '' 
        dia.value = '' 
        tipo.value = '' 
        descricao.value = '' 
        valor.value = ''

    }else{

        document.getElementById('modal_titulo').innerHTML = 'Erro na Gravação'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_descricao').innerHTML = 'Existem campos obrigadorios que não foram preenchidos!'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn-danger'

        $('#modalRegistraDespesa').modal('show')
    }
}

function carregaListaDespesas(){
  
    let despesas = Array();

    despesas = bd.recuperarTodosRegistros();

   let lista = document.getElementById('listaDespesas')

   despesas.forEach(function(d){

       let linha = lista.insertRow();

       linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

       //Ajustar o tipo
       switch(d.tipo){
           case '1': d.tipo = 'Alimentação'
               break
           case '2': d.tipo = 'Educação'
               break
           case '3': d.tipo = 'Lazer'
               break
           case '4': d.tipo = 'Saúde'
               break
           case '5': d.tipo = 'Transporte'
               break
           
       }
       linha.insertCell(1).innerHTML = d.tipo
       linha.insertCell(2).innerHTML = d.descricao
       linha.insertCell(3).innerHTML = d.valor
   })
}


