// Inicializa o mapa na posição central do Brasil
var map = L.map('map').setView([-15.5, -53.5], 4);

// Adiciona o OpenStreetMap como base do mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const ORION_API_URL = "http://20.206.200.173:8080/orion-api/ngsi-ld";
let alunoMarker;
let mainMarker = null;
let mainCircle = null;

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
        } else {
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
        } else {
            mapContent.style.height = "calc(100vh - 100px)"
            mapContent.style.top = "40px";
        }
    })
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
            if (!select) return; 
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
                color: provedor === "Claro BR" ? 'red' : (provedor === "VIVO" || provedor === "Vivo") ? 'purple' : 'blue', // Cor baseada no provedor
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

document.getElementById('about-experiences').onclick = function () {
    Swal.fire({
        title: 'Sobre as Experiências',
        html: `
        <b>Aluno Fujão:</b><br>
        Cadastre a instituição informando os dados de geolocalização (latitude, longitude) e o raio que define a área da instituição. Depois, crie um relacionamento entre o dispositivo e a instituição. Em seguida, utilize o filtro para selecionar o dispositivo desejado e clique em "Aluno Fujão". O sistema irá verificar se o aluno (dispositivo) está dentro ou fora da área delimitada pela instituição.<br><br>
        <b>Cobertura das Operadoras:</b><br>
        Selecione uma operadora específica ou visualize todas. Clique em "Analisar Cobertura" para exibir no mapa a intensidade de sinal dos dispositivos. Passe o mouse sobre cada ponto para ver detalhes como intensidade e informações do sinal.
        `,
        icon: 'info',
        confirmButtonText: 'Fechar'
    });
};

// Carrega as instituições no dropdown
async function carregarInstituicoesDropdown() {
    const dropdown = document.getElementById('dropdownInstituicoes');
    dropdown.innerHTML = '<option>Carregando...</option>';
    try {
        const response = await fetch("http://20.206.200.173:8080/orion-api/ngsi-ld/v1/entities/?type=Instituicao", {
            headers: { "Accept": "application/ld+json" }
        });
        const instituicoes = await response.json();
        dropdown.innerHTML = '';
        instituicoes.forEach(inst => {
            const option = document.createElement('option');
            option.value = inst.id;
            option.textContent = inst.nome?.value || inst.id;
            dropdown.appendChild(option);
        });
        if (instituicoes.length > 0) {
            carregarDevicesDropdown(instituicoes[0].id);
        }
        dropdown.onchange = function () {
            carregarDevicesDropdown(this.value);
        };
    } catch (e) {
        dropdown.innerHTML = '<option>Erro ao carregar</option>';
    }
}

// Carrega os devices relacionados à instituição selecionada
async function carregarDevicesDropdown(instituicaoId) {
    const dropdown = document.getElementById('dropdownDevices');
    dropdown.innerHTML = '<option>Carregando...</option>';
    try {
        // Supondo que o relacionamento seja por atributo "devices" (array de ids) na instituição
        const response = await fetch(`http://20.206.200.173:8080/orion-api/ngsi-ld/v1/entities/${instituicaoId}?options=sysAttrs`, {
            headers: { "Accept": "application/ld+json" }
        });
        const instituicao = await response.json();
        const devices = instituicao.devices?.value || [];
        dropdown.innerHTML = '';
        if (devices.length === 0) {
            dropdown.innerHTML = '<option>Nenhum dispositivo relacionado</option>';
            document.getElementById('relacionamentoInstituicaoDevice').innerHTML = '';
            return;
        }
        devices.forEach(devId => {
            const option = document.createElement('option');
            option.value = devId;
            option.textContent = devId;
            dropdown.appendChild(option);
        });
        // Carrega leitura do primeiro device
        carregarLeituraDevice(devices[0]);
        dropdown.onchange = function () {
            carregarLeituraDevice(this.value);
        };
    } catch (e) {
        dropdown.innerHTML = '<option>Erro ao carregar</option>';
    }
}

// Exibe a leitura do dispositivo selecionado
async function carregarLeituraDevice(deviceId) {
    const div = document.getElementById('relacionamentoInstituicaoDevice');
    div.innerHTML = 'Carregando...';
    try {
        const response = await fetch(`http://20.206.200.173:8080/orion-api/ngsi-ld/v1/entities/${deviceId}?options=sysAttrs`, {
            headers: { "Accept": "application/ld+json" }
        });
        const device = await response.json();
        div.innerHTML = `
            <b>ID:</b> ${device.id}<br>
            <b>Localização:</b> ${device.localizacao?.value?.coordinates?.join(', ') || 'N/A'}<br>
            <b>Intensidade Sinal:</b> ${device.intensidadeSinal?.value || 'N/A'}<br>
            <b>Provedor SIM:</b> ${device.provedorSIM?.value || 'N/A'}
        `;
    } catch (e) {
        div.innerHTML = 'Erro ao carregar leitura do dispositivo.';
    }
}

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

async function abrirModalInstituicaoSwal() {
    Swal.fire({
        title: 'Cadastro de Instituição',
        html: `
            <label>Nome da instituição:</label><br>
            <input id="swal-nomeInstituicao" class="swal-custom-input" placeholder="Nome"><br>
            <label>Latitude:</label>
            <div>
                <button type="button" id="swal-dec-lat" class="decrement">-</button>
                <input type="number" id="swal-lat" class="swal-custom-input" step="any" value="-23.739205815868356">
                <button type="button" id="swal-inc-lat" class="increment">+</button>
            </div>
            <label>Longitude:</label>
            <div>
                <button type="button" id="swal-dec-lng" class="decrement">-</button>
                <input type="number" id="swal-lng" class="swal-custom-input" step="any" value="-46.583589560375515">
                <button type="button" id="swal-inc-lng" class="increment">+</button>
            </div>
            <label>Distância (km):</label>
            <div>
                <button type="button" id="swal-dec-distance" class="decrement">-</button>
                <input type="number" id="swal-distance" class="swal-custom-input" step="any" value="0.5">
                <button type="button" id="swal-inc-distance" class="increment">+</button>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal-custom-popup',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel'
        },
        didOpen: () => {
            // Increment/decrement handlers
            document.getElementById('swal-inc-lat').onclick = () => {
                let input = document.getElementById('swal-lat');
                input.value = (parseFloat(input.value) + 0.1).toFixed(6);
            };
            document.getElementById('swal-dec-lat').onclick = () => {
                let input = document.getElementById('swal-lat');
                input.value = (parseFloat(input.value) - 0.1).toFixed(6);
            };
            document.getElementById('swal-inc-lng').onclick = () => {
                let input = document.getElementById('swal-lng');
                input.value = (parseFloat(input.value) + 0.1).toFixed(6);
            };
            document.getElementById('swal-dec-lng').onclick = () => {
                let input = document.getElementById('swal-lng');
                input.value = (parseFloat(input.value) - 0.1).toFixed(6);
            };
            document.getElementById('swal-inc-distance').onclick = () => {
                let input = document.getElementById('swal-distance');
                input.value = (parseFloat(input.value) + 0.1).toFixed(2);
            };
            document.getElementById('swal-dec-distance').onclick = () => {
                let input = document.getElementById('swal-distance');
                let val = parseFloat(input.value) - 0.1;
                input.value = val < 0 ? 0 : val.toFixed(2);
            };
        },
        preConfirm: () => {
            const nome = document.getElementById('swal-nomeInstituicao').value.trim();
            const lat = document.getElementById('swal-lat').value;
            const lng = document.getElementById('swal-lng').value;
            const distance = document.getElementById('swal-distance').value;
            if (!nome || !lat || !lng || !distance) {
                Swal.showValidationMessage('Preencha todos os campos!');
                return false;
            }
            return { nome, lat, lng, distance };
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const { nome, lat, lng, distance } = result.value;
            const sucesso = criarInstituicao(nome, lat, lng, distance);
            if (sucesso) {
                Swal.fire({
                    text: 'Instituição cadastrada com sucesso!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    text: 'Erro ao cadastrar instituição!',
                    icon: 'error',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        }
    });
}

async function abrirModalConsultaInstituicaoSwal() {
    let instituicoes = [];
    let dispositivos = [];

    try {
        const response_instituicao = await fetch(`${ORION_API_URL}/v1/entities?type=https%3A%2F%2Furi.fiware.org%2Fns%2Fdata-models%23Building`, {
            headers: { "Accept": "application/ld+json" }
        });
        instituicoes = await response_instituicao.json();

        const response_dispositivos = await fetch(`${ORION_API_URL}/v1/entities/?type=https%3A%2F%2Furi.fiware.org%2Fns%2Fdata-models%23Device`, {
            headers: { "Accept": "application/ld+json" }
        });
        dispositivos = await response_dispositivos.json();

    } catch (e) {
        Swal.fire('Erro', 'Erro ao carregar instituições ou dispositivos', 'error');
        return;
    }

    // Opções dropdowns
    const optionsInstituicao = instituicoes.map(inst =>
        `<option value="${inst.id}">${inst["https://schema.org/name"]?.value || inst.id}</option>`
    ).join('');

    const optionsDispositivos = dispositivos.map(dev =>
        `<option value="${dev.id}">${dev["https://schema.org/name"]?.value || dev.id}</option>`
    ).join('');

    // Exibe modal com dropdowns
    Swal.fire({
        title: 'Selecionar Instituição e Dispositivo',
        html: `
            <label>Instituição:</label>
            <select id="swal-dropdownInstituicoes">${optionsInstituicao}</select>
            <br><br>
            <label>Dispositivo:</label>
            <select id="swal-dropdownDevices">${optionsDispositivos}</select>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        customClass: {
            popup: 'swal-custom-popup',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel'
        },
        preConfirm: () => {
            const selectInstituicao = document.getElementById('swal-dropdownInstituicoes');
            const selectDevice = document.getElementById('swal-dropdownDevices');
            const instituicaoId = selectInstituicao.value;
            const dispositivoSelecionado = selectDevice.value;

            if (!instituicaoId || !dispositivoSelecionado) {
                Swal.showValidationMessage('Selecione uma instituição e um dispositivo!');
                return false;
            }

            return { instituicaoId, dispositivoSelecionado };
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            atribuirRelacionamento(result.value.instituicaoId, result.value.dispositivoSelecionado);
        }
    });
}

async function atribuirRelacionamento(instituicaoId, dispositivoId) {
    const url = `${ORION_API_URL}/v1/entityOperations/update?options=update`;
    const body = [
        {
            "id": dispositivoId,
            "type": "https://uri.fiware.org/ns/data-models#Device",
            "controlledAsset": {
                "type": "Relationship",
                "object": instituicaoId
            }
        }
    ];

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            Swal.fire({
                text: "Relacionamento atribuído com sucesso!",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            Swal.fire({
                text: "Erro ao atribuir relacionamento.",
                icon: "error",
                timer: 2000,
                showConfirmButton: false
            });
        }
    } catch (e) {
        Swal.fire({
            text: "Erro ao conectar ao servidor.",
            icon: "error",
            timer: 2000,
            showConfirmButton: false
        });
    }
}

async function criarInstituicao(nome, lat, lng, distance) {
    const url = `${ORION_API_URL}/v1/entities/`;
    const id = `urn:ngsi-ld:Building:${nome.replace(/\s+/g, '').toLowerCase()}`;
    const body = {
        id: id,
        type: "https://uri.fiware.org/ns/data-models#Building",
        name: {
            type: "Property",
            value: nome
        },
        location: {
            type: "GeoProperty",
            value: {
                type: "Point",
                coordinates: [parseFloat(lng), parseFloat(lat)]
            }
        },
        distance: {
            type: "Property",
            value: parseFloat(distance)
        },
        "@context": [
            {
                "name": "https://schema.org/name",
                "location": "http://www.w3.org/2003/01/geo/wgs84_pos#location",
                "distance": "https://schema.org/areaServed",
                "hasDevice": "https://uri.fiware.org/ns/data-models#hasDevice"
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/ld+json"
            },
            body: JSON.stringify(body)
        });
        return response.ok || response.status === 201;
    } catch (e) {
        return false;
    }
}

// Atualiza o campo de instituição relacionada ao selecionar um dispositivo
document.getElementById('devices').addEventListener('change', async function () {
    const deviceId = this.value;
    const instituicaoInput = document.getElementById('instituicao-relacionada');
    instituicaoInput.value = ""; // Limpa o campo

    if (!deviceId) return;

    try {
        // Busca o device para pegar o controlledAsset
        const responseDevice = await fetch(`${ORION_API_URL}/v1/entities/${deviceId}?options=sysAttrs`, {
            headers: { "Accept": "application/ld+json" }
        });
        if (!responseDevice.ok) throw new Error();

        const device = await responseDevice.json();
        const controlledAsset = device.controlledAsset?.object ||
            device["https://uri.etsi.org/ngsi-ld/default-context/controlledAsset"]?.object;

        if (controlledAsset) {
            // Busca todas as instituições para encontrar o nome correspondente ao ID
            const responseInst = await fetch(`${ORION_API_URL}/v1/entities/${controlledAsset}`, {
                headers: { "Accept": "application/ld+json" }
            });
            if (!responseInst.ok) throw new Error();

            const instituicoes = await responseInst.json();
            //const inst = instituicoes.find(i => i.id === controlledAsset);

            if (instituicoes && instituicoes["https://schema.org/name"]?.value) {
                instituicaoInput.value = instituicoes["https://schema.org/name"].value;
            } else {
                instituicaoInput.value = controlledAsset; // fallback para o ID
            }
        }
    } catch (e) {
        instituicaoInput.value = "";
    }
});

// Ao carregar dispositivos, já tenta preencher a instituição se houver um selecionado
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        const select = document.getElementById('devices');
        if (select && select.value) {
            const event = new Event('change');
            select.dispatchEvent(event);
        }
    }, 1000); // Pequeno delay para garantir que o select foi populado
});

async function verificarAlunoInstituicao() {
    const deviceSelect = document.getElementById("devices");
    const instituicaoInput = document.getElementById("instituicao-relacionada");
    const deviceId = deviceSelect.value;
    const instituicaoNome = instituicaoInput.value;

    if (!instituicaoNome) {
        Swal.fire({
            text: "Instituição não definida!",
            icon: 'error',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }
    if (!deviceId) {
        Swal.fire({
            text: "Selecione um dispositivo!",
            icon: 'error',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    try {
        // Busca a instituição pelo nome
        const responseInst = await fetch(`${ORION_API_URL}/v1/entities?type=https%3A%2F%2Furi.fiware.org%2Fns%2Fdata-models%23Building`, {
            headers: { "Accept": "application/ld+json" }
        });
        const instituicoes = await responseInst.json();
        const inst = instituicoes.find(i => i["https://schema.org/name"]?.value === instituicaoNome);

        if (!inst) {
            Swal.fire({
                text: "Instituição não encontrada!",
                icon: 'error',
                timer: 1500,
                showConfirmButton: false
            });
            return;
        }

        const areaServed = inst["https://schema.org/areaServed"].value;

        // Extrai dados de localização e raio (padrão 0,5 km se não houver)
        const lat = inst.location?.value?.coordinates[1];
        const lng = inst.location?.value?.coordinates[0];
        let raio = areaServed * 1000; // 500 metros padrão

        // Plota o círculo no mapa
        if (mainMarker) map.removeLayer(mainMarker);
        if (mainCircle) map.removeLayer(mainCircle);

        mainMarker = L.marker([lat, lng]).addTo(map)
            .bindPopup(`Instituição: ${instituicaoNome}<br>Raio: ${(raio / 1000).toFixed(2)} km`).openPopup();

        mainCircle = L.circle([lat, lng], {
            color: 'blue',
            fillColor: '#add8e6',
            fillOpacity: 0.3,
            radius: raio
        }).addTo(map);

        map.setView([lat, lng], 16);

        // Busca o device e faz a análise já existente
        const responseDev = await fetch(`${ORION_API_URL}/v1/entities/${deviceId}?options=sysAttrs`, {
            headers: { "Accept": "application/ld+json" }
        });
        const detalhes = await responseDev.json();
        const latitude = detalhes.localizacao.value.coordinates[1];
        const longitude = detalhes.localizacao.value.coordinates[0];

        let distanceBetween = getDistanceFromLatLonInMeters(lat, lng, latitude, longitude);
        let dentro = distanceBetween <= raio;
        let markerColor = dentro ? 'green' : 'red';
        let status = dentro ? "DENTRO do raio" : "FORA do raio";

        if (alunoMarker) map.removeLayer(alunoMarker);

        alunoMarker = L.circleMarker([latitude, longitude], {
            color: markerColor,
            radius: 8,
            fillOpacity: 1
        }).addTo(map).bindPopup(`Ponto: ${latitude}, ${longitude}<br><strong>${status}</strong><br>Distância: ${(distanceBetween / 1000).toFixed(2)} km`).openPopup();

        Swal.fire({
            text: `O aluno está ${status}!`,
            icon: dentro ? 'success' : 'warning',
            timer: 1500,
            showConfirmButton: false
        });

    } catch (e) {
        Swal.fire({
            text: "Erro ao buscar dados!",
            icon: 'error',
            timer: 1500,
            showConfirmButton: false
        });
    }
}