class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validardados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }
}

class Bd{

    constructor(){
        let id = localStorage.getItem('id')

        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getproximoid(){
        let proximoid = localStorage.getItem('id')
        return parseInt(proximoid) + 1
    }

    gravar(d){

        let id = this.getproximoid()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){

        let despesas = Array()

        let id = localStorage.getItem('id')

        for(let i = 1; i<= id; i++){

            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa === null){
                continue
            }

            despesa.id = i
            despesas.push(despesa)

        }
        return despesas
    }

    pesquisar(despesa){

        let despesasfiltradas = Array()

        despesasfiltradas = this.recuperarTodosRegistros()  

        if(despesa.ano != ''){
        despesasfiltradas = despesasfiltradas.filter(d => d.ano == despesa.ano)
        }

        if(despesa.mes != ''){
        despesasfiltradas =despesasfiltradas.filter(d => d.mes == despesa.mes)
        }

        if(despesa.dia != ''){
        despesasfiltradas = despesasfiltradas.filter(d => d.dia == despesa.dia)
        }

        if(despesa.tipo != ''){
        despesasfiltradas = despesasfiltradas.filter(d => d.tipo == despesa.tipo)
        }

        if(despesa.descricao != ''){
        despesasfiltradas = despesasfiltradas.filter(d => d.descricao == despesa.descricao)
        }

        if(despesa.valor != ''){
        despesasfiltradas = despesasfiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasfiltradas
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

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

    if(despesa.validardados()){
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


function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
	despesas = bd.recuperarTodosRegistros() 
    }

    let listaDespesas = document.getElementById("listaDespesas")
    listaDespesas.innerHTML = ''

	/*
	<tr>
		<td>15/03/2018</td>
		<td>Alimentação</td>
		<td>Compras do mês</td>
		<td>444.75</td>
	</tr>
	*/

	despesas.forEach(function(d){

		//Criando a linha (tr)
		var linha = listaDespesas.insertRow();

		//Criando as colunas (td)
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
        // botao de excluir

        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

	})

 }

 function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa);

	this.carregaListaDespesas(despesas, true)

 }