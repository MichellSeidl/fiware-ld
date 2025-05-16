// Inicializa o mapa na posição central do Brasil
var map = L.map('map').setView([-15.5, -53.5], 4);

// Adiciona o OpenStreetMap como base do mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let alunoMarker;
let mainMarker = null;
let mainCircle = null;
let mainLat = null;
let mainLng = null;
let mainDistance = null;

function addMainPoint() {
    // Captura os valores do ponto central
    mainLat = parseFloat(document.getElementById('lat').value);
    mainLng = parseFloat(document.getElementById('lng').value);
    mainDistance = parseFloat(document.getElementById('distance').value) * 1000; // Converter km para metros

    if (isNaN(mainLat)) {
        Swal.fire({
            text: "Por favor, insira um valor válido para latitude",
            icon: 'error',
            timer: 1500,
            timerProgressBar: false,
            showConfirmButton: false,
            showClass: {
                popup: `
                  custom-alert
                `
            },
            hideClass: {
                popup: `
                  custom-alert
                `
            }
        });
        return;
    }
    if (isNaN(mainLng)) {
        Swal.fire({
            text: "Por favor, insira um valor válido para longitude.",
            icon: 'error',
            timer: 1500,
            timerProgressBar: false,
            showConfirmButton: false,
            showClass: {
                popup: `
                  custom-alert
                `
            },
            hideClass: {
                popup: `
                  custom-alert
                `
            }
        });
        return;
    }
    if (isNaN(mainDistance)) {
        Swal.fire({
            text: "Por favor, insira um valor válido para distância.",
            icon: 'error',
            timer: 1500,
            timerProgressBar: false,
            showConfirmButton: false,
            showClass: {
                popup: `
                  custom-alert
                `
            },
            hideClass: {
                popup: `
                  custom-alert
                `
            }
        });
        return;
    }

    if (mainDistance < 0) {
        mainDistance = 0;
        document.getElementById('distance').value = mainDistance;
    };

    // Remove marcadores anteriores se existirem
    if (mainMarker) map.removeLayer(mainMarker);
    if (mainCircle) map.removeLayer(mainCircle);

    // Adiciona marcador principal
    mainMarker = L.marker([mainLat, mainLng]).addTo(map)
        .bindPopup(`Ponto Central: ${mainLat}, ${mainLng}<br>Raio: ${(mainDistance / 1000).toFixed(2)} km`).openPopup();

    // Adiciona círculo ao redor
    mainCircle = L.circle([mainLat, mainLng], {
        color: 'blue',
        fillColor: '#add8e6',
        fillOpacity: 0.3,
        radius: mainDistance
    }).addTo(map);

    // Centraliza o mapa no ponto principal
    map.setView([mainLat, mainLng], 13);
}

function increment(id) {
    let step = (id == 'distance') ? 1 : 0.1;
    let oldValue = parseFloat(document.getElementById(id).value) ?? 0;
    let newValue;
    if (isNaN(oldValue)) {
        newValue = 0;
    } else {
        newValue = (id == 'distance') ? (oldValue + step).toFixed(1) : (oldValue + step).toFixed(4);
    }

    document.getElementById(id).value = newValue;
}

function decrement(id) {
    let step = (id == 'distance') ? 1 : 0.1;
    let oldValue = parseFloat(document.getElementById(id).value);
    let newValue;
    if (isNaN(oldValue)) {
        newValue = 0;
    } else {
        newValue = (id == 'distance') ? (oldValue - step).toFixed(1) : (oldValue - step).toFixed(4);
    }

    if (id == 'distance' && newValue < 0) newValue = 0;

    document.getElementById(id).value = newValue;
}

// Chamando a função ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarDispositivos);
document.addEventListener("DOMContentLoaded", carregarProvedores);
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menu-button");
    const exp1Button = document.getElementById("exp1-button");
    const exp2Button = document.getElementById("exp2-button");
    const exp1Section = document.getElementById("exp1-section");
    const exp2Section = document.getElementById("exp2-section");
    const mapContent = document.getElementById('map');

    menuButton.addEventListener("click", function () {
        sidebar.classList.toggle('show');
        if (sidebar.classList.contains('show')) {
            menuButton.innerHTML = "✖";
            menuButton.style.color = '#EE1A40';
            mapContent.style.width = "calc(100vw - 300px)";
        } else {
            menuButton.innerHTML = "☰";
            menuButton.style.color = '#01A5CB';
            mapContent.style.width = "calc(100vw - 100px)";
        }
    })

    exp1Button.addEventListener("click", function () {
        exp1Button.classList.toggle('active');
        if (exp2Button.classList.contains('active')) {
            exp2Button.classList.toggle('active');
        }
        exp1Section.classList.toggle('show');
        if (exp2Section.classList.contains('show')) {
            exp2Section.classList.toggle('show');
        }
        if (exp1Section.classList.contains('show') || exp2Section.classList.contains('show')) {
            mapContent.style.height = "calc(100vh - 220px)"
            mapContent.style.top = "180px";
        }else{
            mapContent.style.height = "calc(100vh - 100px)"
            mapContent.style.top = "40px";
        }
    })

    exp2Button.addEventListener("click", function () {
        exp2Button.classList.toggle('active');
        if (exp1Button.classList.contains('active')) {
            exp1Button.classList.toggle('active');
        }
        exp2Section.classList.toggle('show');
        if (exp1Section.classList.contains('show')) {
            exp1Section.classList.toggle('show');
        }
        if (exp1Section.classList.contains('show') || exp2Section.classList.contains('show')) {
            mapContent.style.height = "calc(100vh - 220px)"
            mapContent.style.top = "180px";
        }else{
            mapContent.style.height = "calc(100vh - 100px)"
            mapContent.style.top = "40px";
        }
    })

    window.analisarProvedores = function () {
        Swal.fire("Analisando cobertura das operadoras...");
    };
});

async function carregarDispositivos() {
    try {
        const response = await fetch("http://20.206.200.173:8080/orion-api/ngsi-ld/v1/entities/?type=https%3A%2F%2Furi.fiware.org%2Fns%2Fdata-models%23Device", {
            headers: { "Accept": "application/ld+json" }
        });

        if (!response.ok) throw new Error(`Erro ao buscar dispositivos: ${response.statusText}`);

        const dispositivos = await response.json();

        const selects = [document.getElementById("devices")];
        selects.forEach(select => {
            if (!select) return; // <-- Adicione esta linha
            select.innerHTML = '<option value="">Selecione um dispositivo</option>';

            dispositivos.forEach(dispositivo => {
                if (dispositivo.id) {
                    const option = document.createElement("option");
                    option.value = dispositivo.id;
                    option.textContent = dispositivo.id;
                    select.appendChild(option);
                }
            });
        });

    } catch (error) {
        console.error("Erro ao carregar dispositivos:", error);
    }
}

function limparMapa() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Circle || layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
            mainMarker = null;
        }
    });
    Swal.fire({
        text: "O experimento foi limpo com sucesso!",
        icon: 'success',
        timer: 1500,
        timerProgressBar: false,
        showConfirmButton: false
    });
}

// Função para obter os detalhes do usuário e verificar a localização
async function verificarAlunoFujao() {
    const select = document.getElementById("devices");
    const deviceId = select.value;

    if (!mainMarker) {
        Swal.fire({
            text: "Defina um ponto central primeiro!",
            icon: 'error',
            timer: 1500,
            timerProgressBar: false,
            showConfirmButton: false
        });
        return;
    }

    if (!deviceId) {
        Swal.fire({
            text: "Selecione um dispositivo!",
            icon: 'error',
            timer: 1500,
            timerProgressBar: false,
            showConfirmButton: false
        });
        return;
    }

    try {
        const response = await fetch(`http://20.206.200.173:8080/orion-api/ngsi-ld/v1/entities/${deviceId}?options=sysAttrs`, {
            headers: { "Accept": "application/ld+json" }
        });

        if (!response.ok) throw new Error(`Erro ao buscar detalhes: ${response.statusText}`);

        const detalhes = await response.json();
        const latitude = detalhes.localizacao.value.coordinates[1];
        const longitude = detalhes.localizacao.value.coordinates[0];

        if (isNaN(latitude) || isNaN(longitude)) {
            Swal.fire({
                text: "Dados de localização inválidos!",
                icon: 'error',
                timer: 1500,
                timerProgressBar: false,
                showConfirmButton: false
            });
            return;
        }

        // Calcula a distância até o ponto central
        let distanceBetween = getDistanceFromLatLonInMeters(mainLat, mainLng, latitude, longitude);
        let dentro = distanceBetween <= mainDistance;
        let markerColor = dentro ? 'green' : 'red';
        let status = dentro ? "DENTRO do raio" : "FORA do raio";

        // Remove marcador anterior se existir
        if (alunoMarker) map.removeLayer(alunoMarker);

        // Adiciona marcador no mapa
        alunoMarker = L.circleMarker([latitude, longitude], {
            color: markerColor,
            radius: 8,
            fillOpacity: 1
        }).addTo(map).bindPopup(`Ponto: ${latitude}, ${longitude}<br><strong>${status}</strong><br>Distância: ${(distanceBetween / 1000).toFixed(2)} km`).openPopup();

        Swal.fire({
            text: `O aluno está ${status}!`,
            icon: dentro ? 'success' : 'warning',
            timer: 1500,
            timerProgressBar: false,
            showConfirmButton: false
        });
    } catch (error) {
        console.error("Erro ao buscar detalhes do aluno:", error);
        Swal.fire({
            text: "Erro ao buscar os dados do aluno.",
            icon: 'error',
            timer: 1500,
            timerProgressBar: false,
            showConfirmButton: false
        });
    }
}

// Adiciona o botão ao lado de "Ver Detalhes"
document.querySelectorAll('.botao-detalhes').forEach(botao => {
    const botaoFujao = document.createElement('button');
    botaoFujao.innerText = "Aluno Fujão";
    botaoFujao.classList.add("botao-fujao");
    botaoFujao.onclick = () => {
        const userId = botao.getAttribute('data-user-id');
        verificarAlunoFujao(userId);
    };
    botao.parentElement.appendChild(botaoFujao);
});

// Função para obter os detalhes do usuário e verificar a localização
async function analisarProvedores() {
    const select = document.getElementById("devices2");
    const deviceId = select.value;

    if (!deviceId) {
        Swal.fire({
            text: "Selecione um dispositivo!",
            icon: 'error',
            timer: 1500,
            timerProgressBar: false,
            showConfirmButton: false
        });
        return;
    }

    try {
        const response = await fetch(`http://20.206.200.173:8080/orion-api/ngsi-ld/v1/entities/${deviceId}?options=sysAttrs`, {
            headers: { "Accept": "application/ld+json" }
        });

        if (!response.ok) throw new Error(`Erro ao buscar detalhes: ${response.statusText}`);

        const detalhes = await response.json();
        const latitude = detalhes.localizacao.value.coordinates[1];
        const longitude = detalhes.localizacao.value.coordinates[0];
        const intensidadeSinal = detalhes.intensidadeSinal.value;
        const provedorSIM = detalhes.provedorSIM.value;

        if (isNaN(latitude) || isNaN(longitude)) {
            Swal.fire({
                text: "Dados de localização inválidos!",
                icon: 'error',
                timer: 1500,
                timerProgressBar: false,
                showConfirmButton: false
            });
            return;
        }

        // Remove marcador anterior se existir
        if (alunoMarker) map.removeLayer(alunoMarker);

        // Adiciona marcador no mapa
        alunoMarker = L.circleMarker([latitude, longitude], {
            color: "green",
            radius: 8,
            fillOpacity: 1
        }).addTo(map).bindPopup
            (`Ponto: ${latitude}, ${longitude}<br>Provedor de Internet <strong>${provedorSIM}</strong><br>Intensidade do Sinal <strong>${intensidadeSinal} db</strong>`).openPopup();
    } catch (error) {
        console.error("Erro ao buscar detalhes do aluno:", error);
        Swal.fire({
            text: "Erro ao buscar os dados do aluno.",
            icon: 'error',
            timer: 1500,
            timerProgressBar: false,
            showConfirmButton: false
        });
    }
}

async function carregarProvedores() {
    try {
        const response = await fetch("http://20.206.200.173:8080/orion-api/ngsi-ld/v1/entities/?type=https%3A%2F%2Furi.fiware.org%2Fns%2Fdata-models%23Device", {
            headers: { "Accept": "application/ld+json" }
        });

        if (!response.ok) throw new Error(`Erro ao buscar dispositivos: ${response.statusText}`);

        const dispositivos = await response.json();

        // Filtrar dispositivos válidos (excluindo "N/A" e null)
        const dispositivosValidos = dispositivos.filter(d => {
            const provedor = d.provedorSIM?.value;
            return provedor && provedor.toUpperCase().trim() !== "N/A";
        });

        // Agrupar dispositivos por nomes normalizados
        const dispositivosAgrupados = dispositivosValidos.reduce((acc, dispositivo) => {
            const provedorNormalizado = normalizarProvedor(dispositivo.provedorSIM?.value) || "Desconhecido";
            if (!acc[provedorNormalizado]) {
                acc[provedorNormalizado] = [];
            }
            acc[provedorNormalizado].push(dispositivo);
            return acc;
        }, {});

        // Criar um conjunto de nomes normalizados para o dropdown
        const provedoresNormalizados = Object.keys(dispositivosAgrupados);

        const providerSelect = document.getElementById("providers");
        providerSelect.innerHTML = '<option value="">Todos os Provedores</option>'; // Adicionar opção para todos os provedores
        provedoresNormalizados.forEach(provedor => {
            const option = document.createElement("option");
            option.value = provedor;
            option.textContent = provedor;
            providerSelect.appendChild(option);
        });

        // Salvar os dispositivos agrupados para uso posterior
        window.dispositivosAgrupados = dispositivosAgrupados;
    } catch (error) {
        console.error("Erro ao carregar provedores:", error);
    }
}

async function plotarPontosOperadora() {
    try {
        const providerFilter = document.getElementById("providers").value;

        // Obter os dispositivos agrupados
        const dispositivosAgrupados = window.dispositivosAgrupados || {};

        // Filtrar dispositivos pelo provedor selecionado
        const dispositivosParaPlotar = providerFilter
            ? dispositivosAgrupados[providerFilter] || [] // Apenas dispositivos do provedor selecionado
            : Object.values(dispositivosAgrupados).flat(); // Todos os dispositivos

        // Limpar camadas anteriores do mapa
        map.eachLayer(layer => {
            if (layer instanceof L.CircleMarker) map.removeLayer(layer);
        });

        // Filtrar dispositivos com intensidade válida (apenas números)
        const dispositivosFiltrados = dispositivosParaPlotar.filter(dispositivo => {
            const intensidade = dispositivo.intensidadeSinal?.value;
            return !isNaN(intensidade); // Verifica se a intensidade é um número
        });

        // Plotar os pontos no mapa
        dispositivosFiltrados.forEach(dispositivo => {
            const lat = dispositivo.localizacao.value.coordinates[1];
            const lng = dispositivo.localizacao.value.coordinates[0];
            const intensidade = dispositivo.intensidadeSinal?.value || "Desconhecido";
            const provedor = dispositivo.provedorSIM?.value || "Desconhecido";
            const tipotecnologia = dispositivo.tipoSinal?.value || "Desconhecido";

            // Adicionar marcador no mapa
            const marker = L.circleMarker([lat, lng], {
                color: provedor === "Claro BR"  ? 'red' : (provedor === "VIVO" || provedor === "Vivo") ? 'purple' : 'blue', // Cor baseada no provedor
                radius: 8,
                fillOpacity: 0.8
            }).addTo(map);
            
            marker.bindPopup(
                `<strong>Provedor:</strong> ${provedor}<br>
                <strong>Intensidade do Sinal:</strong> ${classificarSinal(intensidade)} (${intensidade} db)<br>
                <strong>Tecnologia:</strong> ${tipotecnologia} <br>
                <strong>Localização:</strong> ${lat}, ${lng}`
            );

            marker.on('mouseover', function () {
                this.openPopup();
            });
            marker.on('mouseout', function () {
                this.closePopup();
            });
        });
    } catch (error) {
        console.error("Erro ao plotar pontos no mapa:", error);
    }
}

document.getElementById('about-experiences').onclick = function() {
    Swal.fire({
        title: 'Sobre as Experiências',
        html: `
        <b>Aluno fujão:</b><br>
        Defina um ponto central (latitude, longitude e raio) e selecione um dispositivo. O sistema verifica se o aluno está dentro ou fora da área definida.<br><br>
        <b>Cobertura das Operadoras:</b><br>
        Selecione um provedor ou visualize todos. Clique em "Analisar Cobertura" para ver no mapa a intensidade do sinal dos dispositivos. Passe o mouse sobre os pontos para detalhes.
        `,
        icon: 'info',
        confirmButtonText: 'Fechar'
    });
};

// Funções de validação e formatação

// Função para converter graus em radianos
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Função para calcular a distância entre dois pontos
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    var R = 6371000; // Raio da Terra em metros
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c; // Distância em metros
    return distance;
}

// Variavel constante que normaliza os nomes dos provedores 
const normalizarProvedor = (nome) => {
    if (!nome || nome.toUpperCase().trim() == "N/A") return null; // Remove "N/A" e valores nulos
    const nomeLimpo = nome.toUpperCase().trim();
    if (nomeLimpo.includes("TIM")) return "TIM";
    if (nomeLimpo.includes("VIVO")) return "VIVO";
    if (nomeLimpo.includes("CLARO")) return "Claro BR";
    return nome; 
};

// Função para classificar o sinal
function classificarSinal(dbm) {
  // Limita o valor de dBm entre -110 e -50
  if (dbm < -110) dbm = -110;
  if (dbm > -50) dbm = -50;

  // Normalização
  const q = (dbm + 110) / 60;

  // Classificação
  let categoria;
  if (q < 0.33) {
    return categoria = "Ruim";
  } else if (q < 0.58) {
    return categoria = "Razoável";
  } else {
    return categoria = "Bom";
  }
}
