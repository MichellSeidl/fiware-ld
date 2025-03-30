// Inicializa o mapa na posição central do Brasil
var map = L.map('map').setView([-14.235, -51.9253], 4);

let clickedAlunoFujao = false;
let clickedAnaliseProvedores = false;
let alunoMarker;

// Adiciona o OpenStreetMap como base do mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

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

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function increment(id) {
    let step = (id == 'distance') ? 1 : 0.1;
    let oldValue = parseFloat(document.getElementById(id).value) ?? 0;
    let newValue;
    if (isNaN(oldValue)) {
        newValue = 0;
    } else {
        newValue = (id == 'distance') ? (oldValue + step).toFixed(0) : (oldValue + step).toFixed(4);
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
        newValue = (id == 'distance') ? (oldValue - step).toFixed(0) : (oldValue - step).toFixed(4);
    }

    if (id == 'distance' && newValue < 0) newValue = 0;

    document.getElementById(id).value = newValue;
}

function hoverAlunoFujao(isHovered) {
    const alunoFujao = document.getElementById('aluno-fujao');
    if (isHovered) {
        alunoFujao.style.top = '0px';
    } else {
        alunoFujao.style.top = '-200px';
    }
}

function hoverAnaliseProvedores(isHovered) {
    if (mainMarker) map.removeLayer(mainMarker);
    if (mainCircle) map.removeLayer(mainCircle);
    const analiseProvedores = document.getElementById('analise-provedores');
    if (isHovered) {
        analiseProvedores.style.top = '0px';
    } else {
        analiseProvedores.style.top = '-200px';
    }
}

/* index.js */
document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const toggleMenuButton = document.getElementById("toggle-menu");
    const alunoFujaoSection = document.getElementById("aluno-fujao");
    const alunoFujaoButton = document.getElementById("aluno-fujao-button");
    const analiseProvedoresButton = document.getElementById("analise-provedores-button");
    const analiseProvedoresSection = document.getElementById("analise-provedores");
    const mainContent = document.getElementById("main-content");

    toggleMenuButton.addEventListener("click", function () {
        if (sidebar.style.left === "0px") {
            sidebar.style.left = "-250px";
            mainContent.style.marginLeft = "0px";
            toggleMenuButton.style.left = "";
            toggleMenuButton.style.right = "-50px";
            toggleMenuButton.innerHTML = "☰";
        } else {
            sidebar.style.left = "0px";
            mainContent.style.marginLeft = "250px";
            toggleMenuButton.style.left = "200px";
            toggleMenuButton.style.right = "";
            toggleMenuButton.innerHTML = "✖";
        }
    });

    alunoFujaoButton.addEventListener("mouseenter", function () {
        hoverAlunoFujao(true);
    });
    alunoFujaoButton.addEventListener("mouseleave", function () {
        hoverAlunoFujao(false);
    });

    alunoFujaoButton.addEventListener("click", function () {
        if (clickedAlunoFujao == false) {
            hoverAlunoFujao(true);
            alunoFujaoButton.addEventListener("mouseenter", function () {
                hoverAlunoFujao(true);
            });
            alunoFujaoButton.addEventListener("mouseleave", function () {
                hoverAlunoFujao(true);
            });
            analiseProvedoresButton.addEventListener("mouseenter", function () {
                hoverAnaliseProvedores(false);
            });
            analiseProvedoresButton.addEventListener("mouseleave", function () {
                hoverAnaliseProvedores(false);
            });
            clickedAlunoFujao = true;
            clickedAnaliseProvedores = true;
        } else {
            hoverAlunoFujao(false);
            alunoFujaoButton.addEventListener("mouseenter", function () {
                hoverAlunoFujao(true);
            });
            alunoFujaoButton.addEventListener("mouseleave", function () {
                hoverAlunoFujao(false);
            });
            hoverAnaliseProvedores(false);
            analiseProvedoresButton.addEventListener("mouseenter", function () {
                hoverAnaliseProvedores(true);
            });
            analiseProvedoresButton.addEventListener("mouseleave", function () {
                hoverAnaliseProvedores(false);
            });
            clickedAlunoFujao = false;
            clickedAnaliseProvedores = false;
        }
    });

    analiseProvedoresButton.addEventListener("mouseenter", function () {
        hoverAnaliseProvedores(true);
    });
    analiseProvedoresButton.addEventListener("mouseleave", function () {
        hoverAnaliseProvedores(false);
    });

    analiseProvedoresButton.addEventListener("click", function () {
        if (clickedAnaliseProvedores == false) {
            hoverAnaliseProvedores(true);
            analiseProvedoresButton.addEventListener("mouseenter", function () {
                hoverAnaliseProvedores(true);
            });
            analiseProvedoresButton.addEventListener("mouseleave", function () {
                hoverAnaliseProvedores(true);
            });
            alunoFujaoButton.addEventListener("mouseenter", function () {
                hoverAlunoFujao(false);
            });
            alunoFujaoButton.addEventListener("mouseleave", function () {
                hoverAlunoFujao(false);
            });
            clickedAnaliseProvedores = true;
            clickedAlunoFujao = true;
        } else {
            hoverAnaliseProvedores(false);
            analiseProvedoresButton.addEventListener("mouseenter", function () {
                hoverAnaliseProvedores(true);
            });
            analiseProvedoresButton.addEventListener("mouseleave", function () {
                hoverAnaliseProvedores(false);
            });
            hoverAlunoFujao(false);
            alunoFujaoButton.addEventListener("mouseenter", function () {
                hoverAlunoFujao(true);
            });
            alunoFujaoButton.addEventListener("mouseleave", function () {
                hoverAlunoFujao(false);
            });
            clickedAnaliseProvedores = false;
            clickedAlunoFujao = false;
        }
    });

    var map = L.map('map').setView([-23.5505, -46.6333], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    window.addMainPoint = function () {
        let lat = parseFloat(document.getElementById("lat").value);
        let lng = parseFloat(document.getElementById("lng").value);
        L.marker([lat, lng]).addTo(map)
            .bindPopup("Ponto Central")
            .openPopup();
    };

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
        console.log("Dispositivos recebidos:", dispositivos);

        const selects = [document.getElementById("devices1"), document.getElementById("devices2")];
        selects.forEach(select => {
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

// Chamando a função ao iniciar a página
document.addEventListener("DOMContentLoaded", carregarDispositivos);


// Função para verificar se um ponto está dentro da área delimitada
function estaDentroDaRegiao(lat, lng, poligono) {
    let dentro = false;
    let j = poligono.length - 1;
    for (let i = 0; i < poligono.length; i++) {
        if ((poligono[i][1] > lng) !== (poligono[j][1] > lng) &&
            lat < (poligono[j][0] - poligono[i][0]) * (lng - poligono[i][1]) / (poligono[j][1] - poligono[i][1]) + poligono[i][0]) {
            dentro = !dentro;
        }
        j = i;
    }
    return dentro;
}

// Função para obter os detalhes do usuário e verificar a localização
async function verificarAlunoFujao() {
    const select = document.getElementById("devices1");
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