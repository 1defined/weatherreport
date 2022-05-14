//buscar os dados preenchidos no formulário sem submeter a página (requisição interna)

//interceptar formulário            //falando para o JS que nessa função tem código não-ordenado (promises)
document.querySelector('.busca').addEventListener('submit', async(event) => {
    //1º passo: não enviar o formulário, pois a página seria atualizada e se perderiam os dados
    event.preventDefault(); //função que previne o comportamento padrão, logo, n dá submit na page
    
    //pegar o que o usuário digitou
let input =    document.querySelector('#searchInput').value; //recupera o conteúdo do HTML dentro do input

    //validar se o input do usuário não está vazio 
    if(input !== ''){
       
        ///////perfumaria -> toca o audio do weather report
             let wheaterReport = document.querySelector('#koi');
             wheaterReport.play();
        /////////////
       
       
        //criar uma forma para o usuário visualizar que está carregando (usaremos div de aviso para isso)
        showWarning('Loading...');

        //preciso converter o input para que ele não fique com espaços e etc que o usuário irá digitar
        input = encodeURI(input);


        //buscar na documentação da API usada (openweatherMap) a documentação para montar a URL
        //api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
        //API key = hash usado para identificar quem está consultando a API bem como limitar o uso. Precisa ser passado. É encontrado no site, após fazer cadastro, na sessão de usuário

        
                                                                //input convertido
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=cf6b075bcb78e42935ad4bd30368ae55&units=metric&lang=pt_br`; 
        
        //Usando a URL para fazer a requisição usando a função JS fetch (promessas) aguarda o retorno da req
        let results = await fetch(url); //faço a requisição + espero resultado (await)
        let json = await results.json(); //guardo o resultado do json retornado num objeto
        console.log(input);
        //Verificar se a cidade procurada foi encontrada. O retorno do JSON traz um código, 200 = deu certo e 404 = notFound
        if(json.cod === 200){
            //Se encontrou, preencho as informações no HTML
            console.log(json);
            //montar objeto antes de mandar para a função showInfo
            showInfo({
                name: json.name, //puxando a cidade
                country: json.sys.country, //puxando o país
                temp: json.main.temp, //puxando a temperatura
                tempIcon: json.weather[0].icon, //puxando o nome do arquivo de icone do tempo
                windSpeed: json.wind.speed, //puxando a velocidade do vento
                windAngle: json.wind.deg //puxando pra onde o vento está apontando
            });
           

        }else {
            //função que limpa os campos existentes já preenchidos
            clearInfo();
            showWarning('Weather Report não pôde encontrar este lugar.')
        }




    }else {
        //se o usuário esvaziar o input e pesquisar novamente, irá limpar as informações     
        clearInfo();
    }
});



//Função específica para inserir os dados nas divs de resultados
function showInfo(json){
  //retirar o carregamento, pois já tenho resposta da API
    showWarning('');

    //preencher as informações
    document.querySelector('.titulo').innerHTML = `${json.name}, ${json.country}`; 

    //OBS: dentro da div tempInfo tenho uma tag sup que receberá a inf cº, ela também vai ser substituída no innerHTML, então teremos que refaze-la ao passar este comando 
    document.querySelector('.tempInfo').innerHTML = `${json.temp} <sup>ºC</sup>`; 
    document.querySelector('.ventoInfo').innerHTML= `${json.windSpeed} <span>KM/H</span>`;

    //A div está preparada para receber o link da img da API, então trocamos o atributo src para ficar dinâmico e colocamos a variável que contém o nome do icone no lugar indicado
    document.querySelector('.temp img').setAttribute('src',`http://openweathermap.org/img/wn/${json.tempIcon}@2x.png` );
    
    //Mostrar a posição do vento usando os degraus que retornam no JSON
    //OBS assim como no relógio, o padrão dos graus é a direita, então compensamos com -90 graus sempre no calculo
    document.querySelector('.ventoPonto').style.transform = `rotate(${json.windAngle-90}deg)`;
   
    document.querySelector('.resultado').style.display = 'block'; //mostrar resultado ao final de preencher



};



//função que retorna o erro
function showWarning(msg){

    document.querySelector('.aviso').innerHTML = msg;

};

function clearInfo(){
    showWarning(''); //limpa o aviso da tela
    document.querySelector('.resultado').style.display = 'none'; //oculta as informações de resultado

};