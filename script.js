function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var adicionarDivs = function(){
	$('body').append('<div id="teste"></div>');
	$('#teste').html('');
	$('#teste').append('<div id="teste-input" style="text-align:center;"></div>');
	$('#teste').append('<div id="teste-resultado" style="text-align:center;"></div>');
}
var adicionarInputs = function(){
	$('#teste-input').html('');
	$('#teste-input').append('<div style="margin-top: 40px;"><h4>Pesquisa instância em Lote</h4></div>');
	$('#teste-input').append('<div style="margin-top: 5px;"><textarea id="txt-telefones"></textarea></div>');
	$('#teste-input').append('<div style="margin-top: 5px;"><button id="btn-procurar-instancia">Procurar Instância</button></div>');
}

var verificarCamposObrigatoriosPreenchidos = function(){
	if(!$('input[name=ambiente_qa]:checked').size()){
		return false;
	}
	if(!$('select').val()){
		return false;
	}
	return true;
}

var testeValidar = function(ambiente_qa,cidades,telefones){
	$.ajax({			
		type: 'POST',
		data: { 
			ambiente_qa:ambiente_qa,
			cidades:cidades ,
			telefone: telefones[0]
		},
		
		url: 'MainServlet?cmd=consultar',
		dataType: "html",
		success: function(retorno){
			if(verificarLinhaDisponivel(retorno)){
				$('#teste-resultado').html('<div><h3>Instância Disponível: '+telefones[0]+'</h3></div><div>'+retorno+'</div>');
				removerHtml();
			}
			else{
				telefones.splice(0,1);
				if(telefones.length>0&&telefones[0])testeValidar(ambiente_qa,cidades,telefones);
				else{
					$('#teste-resultado').html('');
					alert('Não foi encontrado nenhum telefone');
				} 
			}			
		},
		beforeSend: function(){
		},
		complete: function(){
		}
	});
}

var verificarLinhaDisponivel = function(html){
	if(html.search("Linha Ocupada")==-1&&html.search("Linha ativa no Siebel 5")==-1){
		return true;
	}
	return false;
}

var removerHtml = function(){
	removeTabelas();
	removeHead();
	removeTitulo();
	removeInput();
}

var removeTabelas = function(){
	var cont = 0;
	$('#teste-resultado').find('table').each(function(){
		if(cont!=1){
			$(this).remove();
		}
		cont++;
	});
}

var removeHead = function(){
	$('#teste-resultado').find('meta').remove();
	$('#teste-resultado').find('title').remove();
	$('#teste-resultado').find('link').remove();
	$('#teste-resultado').find('script').remove();
	$('#teste-resultado').find('style').remove();
}

var removeTitulo = function(){
	$('#teste-resultado').find('.index').remove();
}

var removeInput = function(){
	$('#teste-resultado').find('input').remove();
}

var recuperaTelefones = function(){
	var telefonesSE = retornaApenasNumero($('#txt-telefones').val()).split("\n");
	
	telefones = [];
	telefonesSE.forEach(function(telefone){
		if(telefone){
			if(isNumber(telefone)&&telefone>1000000000&&telefone<9999999999)telefones.push(telefone);
		}
	});
	return telefones;
}

var retornaApenasNumero = function(txt){
	var ret = '';
	for(var i = 0;i<txt.length;i++){
		if((txt[i].charCodeAt(0) >= 48 && txt[i].charCodeAt(0) <= 57 ) || txt[i].charCodeAt(0) == 10){
			ret += txt[i];
		}
	}
	return ret;
}

$('body').on('click','#btn-procurar-instancia',function(){
	if(verificarCamposObrigatoriosPreenchidos()){
		var telefones = recuperaTelefones();
		if(telefones.length>0){
			$('#teste-resultado').html('Pesquisando... Aguarde!');
			var ambiente_qa = $('input[name=ambiente_qa]:checked').val();
			var cidade = $('select').val();
			testeValidar(ambiente_qa,cidade,telefones);
		}
		else alert('Não foi encontrado nenhum telefone');		
	}
	else{
		alert('Selecione o Ambiente');
	}
});

adicionarDivs();
adicionarInputs();