document.addEventListener('DOMContentLoaded', () => {
    // --- Tema Claro/Escuro ---
    const themeToggleBtn = document.createElement('button');
    themeToggleBtn.id = 'theme-toggle-btn';
    themeToggleBtn.className = 'btn btn-outline-secondary position-fixed';
    themeToggleBtn.style.top = '1rem';
    themeToggleBtn.style.right = '1rem';
    themeToggleBtn.style.zIndex = '9999';
    themeToggleBtn.title = 'Alternar tema claro/escuro';
    // Usa ícone Unicode se Bootstrap Icons não estiver disponível
    function getThemeIcon(theme) {
        if (window.bootstrap && document.createElement('i').classList) {
            return theme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
        } else {
            return theme === 'dark' ? '☀️' : '🌙';
        }
    }
    themeToggleBtn.innerHTML = getThemeIcon('light');
    document.body.appendChild(themeToggleBtn);

    // Função para aplicar o tema
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggleBtn.innerHTML = getThemeIcon(theme);
        localStorage.setItem('theme', theme);
        
        // Força o reflow para garantir que as mudanças sejam aplicadas
        const root = document.documentElement;
        root.style.display = 'none';
        root.offsetHeight; // Força o reflow
        root.style.display = '';
    }

    // Detecta tema salvo ou preferência do sistema
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    applyTheme(currentTheme);

    // Alterna tema ao clicar no botão
    themeToggleBtn.addEventListener('click', () => {
        currentTheme = (currentTheme === 'dark') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme);
    });
    // --- INÍCIO: Configuração do Firebase ---
    // IMPORTANTE: Substitua com as credenciais do seu projeto Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAGp0iUU8Ived_dAOdNFEg1amEX6tj-bzE",
        authDomain: "fuel-tracker-app-bdbb5.firebaseapp.com",
        projectId: "fuel-tracker-app-bdbb5",
        storageBucket: "fuel-tracker-app-bdbb5.firebasestorage.app",
        messagingSenderId: "183415745299",
        appId: "1:183415745299:web:db7a3e35e3a9c1962f48e6",
        measurementId: "G-Z29255BPSE"
    };

    // Inicializa o Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    // --- FIM: Configuração do Firebase ---

    // --- Seleção de Elementos do DOM ---
    const loginPage = document.getElementById('login-page');
    const dashboardPage = document.getElementById('dashboard-page');
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const googleLoginBtn = document.getElementById('google-login');
    const logoutBtn = document.getElementById('logout-btn');
    const userNameSpan = document.getElementById('user-name');
    const createAccountLink = document.getElementById('create-account');
    const forgotPasswordLink = document.getElementById('forgot-password');

    // --- Elementos da Página de Criação de Conta ---
    const createAccountPage = document.getElementById('create-account-page');
    const createAccountForm = document.getElementById('create-account-form');
    const newEmailInput = document.getElementById('new-email');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const backToLoginLink = document.getElementById('back-to-login');
    const loginLoadingSpinner = document.getElementById('login-loading');
    const togglePasswordBtn = document.getElementById('toggle-password');

    // Toast de notificação
    const toastElement = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toast = new bootstrap.Toast(toastElement);

    // Modal de "Esqueci a Senha"
    const forgotPasswordModalElement = document.getElementById('forgot-password-modal');
    const forgotPasswordModal = new bootstrap.Modal(forgotPasswordModalElement);
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const resetEmailInput = document.getElementById('reset-email');

    // --- Elementos do Formulário de Abastecimento ---
    const refuelForm = document.getElementById('refuel-form');
    const refuelDateInput = document.getElementById('refuel-date');
    const fuelTypeInput = document.getElementById('fuel-type');
    const mileageInput = document.getElementById('mileage');
    const gasStationInput = document.getElementById('gas-station');
    const observationsInput = document.getElementById('observations');
    const cancelRefuelBtn = document.getElementById('cancel-refuel');

    // --- Elementos da Página de Histórico ---
    const historyTableBody = document.getElementById('refuel-history-table');
    const filterDateStartInput = document.getElementById('filter-date-start');
    const filterDateEndInput = document.getElementById('filter-date-end');
    const filterFuelTypeInput = document.getElementById('filter-fuel-type');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const historyPaginationNav = document.getElementById('history-pagination-nav');
    const paginationPrevBtn = document.getElementById('pagination-prev');
    const paginationNextBtn = document.getElementById('pagination-next');
    const paginationCurrentPageEl = document.getElementById('pagination-current-page');

    // --- Estado da Aplicação ---
    // Não é mais necessário estado de paginação para o histórico

    // --- Modais de Ação ---
    const editRefuelModalElement = document.getElementById('edit-refuel-modal');
    const editRefuelModal = new bootstrap.Modal(editRefuelModalElement);
    const editRefuelForm = document.getElementById('edit-refuel-form');
    const editDocIdInput = document.getElementById('edit-doc-id');

    const deleteConfirmModalElement = document.getElementById('delete-confirm-modal');
    const deleteConfirmModal = new bootstrap.Modal(deleteConfirmModalElement);
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

    // --- Inputs do formulário de edição ---
    const editLitersInput = document.getElementById('edit-liters');
    const editTotalValueInput = document.getElementById('edit-total-value');
    const editPricePerLiterInput = document.getElementById('edit-price-per-liter');

    // --- Elementos do Dashboard ---
    const avgConsumptionEl = document.getElementById('avg-consumption');
    const monthlySpendingEl = document.getElementById('monthly-spending');
    const lastRefuelDateEl = document.getElementById('last-refuel-date');
    const currentMileageEl = document.getElementById('current-mileage');
    const recentRefuelsList = document.getElementById('recent-refuels');
    const spendingChartCanvas = document.getElementById('spendingChart');
    let spendingChartInstance = null; // Variável para guardar a instância do gráfico

    // --- Elementos da Página de Estatísticas ---
    const statsContent = document.getElementById('statistics-content');
    const statsPlaceholder = document.getElementById('stats-placeholder');
    const consumptionChartCanvas = document.getElementById('consumptionChart');
    const monthlySpendingChartCanvas = document.getElementById('monthlySpendingChart');
    const fuelTypeChartCanvas = document.getElementById('fuelTypeChart');
    const mileageChartCanvas = document.getElementById('mileageChart');
    let consumptionChartInstance, monthlySpendingChartInstance, fuelTypeChartInstance, mileageChartInstance;

    const bestConsumptionEl = document.getElementById('best-consumption');
    const bestConsumptionDetailsEl = document.getElementById('best-consumption-details');
    const worstConsumptionEl = document.getElementById('worst-consumption');
    const worstConsumptionDetailsEl = document.getElementById('worst-consumption-details');
    const mostUsedStationEl = document.getElementById('most-used-station');
    const mostUsedStationDetailsEl = document.getElementById('most-used-station-details');



    // --- Funções Auxiliares ---

    /**
     * Exibe o spinner de carregamento e desabilita o formulário.
     * @param {boolean} isLoading - True para mostrar, false para esconder.
     */
    const setLoading = (isLoading) => {
        loginLoadingSpinner.style.display = isLoading ? 'block' : 'none';
        // Esconde ambos os formulários durante o carregamento
        createAccountForm.style.display = isLoading ? 'none' : 'block';
        loginForm.style.display = isLoading ? 'none' : 'block';
    };

    /**
     * Exibe uma notificação (toast).
     * @param {string} message - A mensagem a ser exibida.
     * @param {string} type - 'success' ou 'danger'.
     */
    const showToast = (message, type = 'success') => {
        toastMessage.textContent = message;
        toastElement.classList.remove('bg-success', 'bg-danger');
        toastElement.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');
        toast.show();
    };

    // --- Lógica de Autenticação ---

    /**
     * Observador do estado de autenticação.
     * Executado quando o usuário faz login ou logout.
     */
    auth.onAuthStateChanged(user => {
        setLoading(false);
        if (user) {
            // Usuário está logado
            loginPage.classList.add('d-none');
            createAccountPage.classList.add('d-none');
            dashboardPage.classList.remove('d-none');
            userNameSpan.textContent = user.displayName || user.email.split('@')[0];
            updateDashboard(); // Atualiza o dashboard ao logar
        } else {
            // Usuário está deslogado
            createAccountPage.classList.add('d-none'); // Garante que a tela de registro esteja escondida
            loginPage.classList.remove('d-none');
            dashboardPage.classList.add('d-none');
            userNameSpan.textContent = 'Usuário';
        }
    });

    /**
     * Login com Email e Senha
     */
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            showToast('Por favor, preencha email e senha.', 'danger');
            return;
        }

        setLoading(true);
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                // Login bem-sucedido, o onAuthStateChanged cuidará da UI.
                console.log('Login bem-sucedido:', userCredential.user);
                showToast('Login realizado com sucesso!');
            })
            .catch(error => {
                console.error('Erro no login:', error);
                let message = 'Ocorreu um erro ao tentar fazer login.';
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                    message = 'Email ou senha inválidos.';
                }
                showToast(message, 'danger');
            })
            .finally(() => {
                setLoading(false);
            });
    });

    /**
     * Login com Google
     */
    googleLoginBtn.addEventListener('click', () => {
        setLoading(true);
        auth.signInWithPopup(googleProvider)
            .then(result => {
                // Login com Google bem-sucedido.
                console.log('Login com Google bem-sucedido:', result.user);
                showToast('Login com Google realizado com sucesso!');
            })
            .catch(error => {
                console.error('Erro no login com Google:', error);
                showToast('Ocorreu um erro ao tentar login com Google.', 'danger');
            })
            .finally(() => {
                setLoading(false);
            });
    });

    /**
     * Logout
     */
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            // Logout bem-sucedido, o onAuthStateChanged cuidará da UI.
            showToast('Você saiu da sua conta.');
        }).catch(error => {
            console.error('Erro ao sair:', error);
            showToast('Ocorreu um erro ao tentar sair.', 'danger');
        });
    });

    /**
     * Lógica para Criar Conta
     */
    createAccountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newEmailInput.value;
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            showToast('As senhas não coincidem.', 'danger');
            return;
        }

        setLoading(true);
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                // Sucesso! O onAuthStateChanged vai lidar com a mudança de tela.
                console.log('Conta criada com sucesso:', userCredential.user);
                showToast('Conta criada com sucesso! Bem-vindo(a)!');
            })
            .catch(error => {
                console.error('Erro ao criar conta:', error);
                let message = 'Ocorreu um erro ao criar a conta.';
                if (error.code === 'auth/weak-password') {
                    message = 'Sua senha é muito fraca. Use pelo menos 6 caracteres.';
                } else if (error.code === 'auth/email-already-in-use') {
                    message = 'Este e-mail já está em uso.';
                } else if (error.code === 'auth/invalid-email') {
                    message = 'O e-mail fornecido é inválido.';
                }
                showToast(message, 'danger');
            })
            .finally(() => {
                setLoading(false);
            });
    });

    /**
     * Lógica para "Esqueci a Senha"
     */
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = resetEmailInput.value;

        auth.sendPasswordResetEmail(email)
            .then(() => {
                forgotPasswordModal.hide();
                showToast('Link de recuperação enviado! Verifique seu e-mail.');
            })
            .catch(error => {
                console.error('Erro ao enviar e-mail de recuperação:', error);
                let message = 'Ocorreu um erro.';
                if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-email') {
                    message = 'Nenhum usuário encontrado com este e-mail.';
                }
                showToast(message, 'danger');
            });
    });

    /**
     * Salvar Novo Abastecimento no Firestore
     */
    refuelForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            showToast('Você precisa estar logado para salvar um abastecimento.', 'danger');
            return;
        }

        // Coleta e converte os dados do formulário
        const refuelData = {
            userId: user.uid, // Associa o registro ao usuário logado
            date: refuelDateInput.value,
            fuelType: fuelTypeInput.value,
            mileage: parseInt(mileageInput.value, 10),
            liters: parseFloat(litersInput.value),
            totalValue: parseFloat(totalValueInput.value),
            pricePerLiter: parseFloat(pricePerLiterInput.value),
            gasStation: gasStationInput.value.trim(),
            observations: observationsInput.value.trim(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp() // Melhor prática para timestamps
        };

        // Validação simples dos campos obrigatórios
        if (!refuelData.date || !refuelData.fuelType || isNaN(refuelData.mileage) || isNaN(refuelData.liters) || isNaN(refuelData.totalValue)) {
            showToast('Por favor, preencha todos os campos obrigatórios corretamente.', 'danger');
            return;
        }

        // Adiciona o novo documento à coleção 'refuels'
        db.collection('refuels').add(refuelData)
            .then((docRef) => {
                console.log("Documento salvo com ID: ", docRef.id);
                showToast('Abastecimento salvo com sucesso!', 'success');
                refuelForm.reset(); // Limpa o formulário
                pricePerLiterInput.value = ''; // Limpa o campo readonly
                // Navega para a página de histórico para ver o novo registro
                document.querySelector('[data-page="history"]').click();
            })
            .catch((error) => {
                console.error("Erro ao salvar documento: ", error);
                showToast('Erro ao salvar o abastecimento. Tente novamente.', 'danger');
            });
    });

    cancelRefuelBtn.addEventListener('click', () => {
        refuelForm.reset();
        pricePerLiterInput.value = '';
        document.querySelector('[data-page="dashboard"]').click();
    });

    /**
     * Busca dados e atualiza os cards e gráficos do Dashboard.
     */
    const updateDashboard = () => {
        const user = auth.currentUser;
        if (!user) return;

        // Define um estado de carregamento/padrão
        avgConsumptionEl.textContent = '...';
        monthlySpendingEl.textContent = '...';
        lastRefuelDateEl.textContent = '...';
        currentMileageEl.textContent = '...';
        recentRefuelsList.innerHTML = '<div class="list-group-item">Carregando...</div>';

        db.collection('refuels')
            .where('userId', '==', user.uid)
            .orderBy('date', 'asc')
            .get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    avgConsumptionEl.textContent = 'N/A';
                    monthlySpendingEl.textContent = 'R$ 0,00';
                    lastRefuelDateEl.textContent = 'N/A';
                    currentMileageEl.textContent = 'N/A';
                    recentRefuelsList.innerHTML = '<div class="list-group-item">Nenhum abastecimento registrado.</div>';
                    // Limpa o gráfico se não houver dados
                    if (spendingChartInstance) {
                        spendingChartInstance.destroy();
                        spendingChartInstance = null;
                    }
                    return;
                }

                const refuels = querySnapshot.docs.map(doc => doc.data());

                // --- Cálculos para os Cards ---

                // 1. Último abastecimento e quilometragem
                const mostRecentRefuel = refuels[refuels.length - 1];
                currentMileageEl.textContent = `${mostRecentRefuel.mileage.toLocaleString('pt-BR')} km`;
                lastRefuelDateEl.textContent = new Date(mostRecentRefuel.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });

                // 2. Gasto no mês atual
                const now = new Date();
                const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
                const monthlySpending = refuels
                    .filter(r => r.date.substring(0, 7) === currentMonthKey)
                    .reduce((sum, r) => sum + r.totalValue, 0);
                monthlySpendingEl.textContent = `R$ ${monthlySpending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

                // 3. Consumo médio
                const consumptions = [];
                refuels.forEach((current, index) => {
                    if (index < refuels.length - 1) {
                        const next = refuels[index + 1];
                        const km = next.mileage - current.mileage;
                        if (km > 0 && current.liters > 0) {
                            consumptions.push(km / current.liters);
                        }
                    }
                });
                const avgConsumption = consumptions.length > 0 ? consumptions.reduce((a, b) => a + b, 0) / consumptions.length : 0;
                avgConsumptionEl.textContent = `${avgConsumption.toFixed(1).replace('.', ',')} km/L`;

                // --- Lista de Abastecimentos Recentes ---
                recentRefuelsList.innerHTML = '';
                const recentThree = [...refuels].reverse().slice(0, 3);
                recentThree.forEach(r => {
                    const date = new Date(r.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
                    const item = `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between">
                                <div>
                                    <h6 class="mb-1">${r.gasStation || 'Não informado'}</h6>
                                    <small class="text-muted">${date} - ${r.fuelType.charAt(0).toUpperCase() + r.fuelType.slice(1)}</small>
                                </div>
                                <span class="fw-bold">R$ ${r.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                            </div>
                        </div>`;
                    recentRefuelsList.innerHTML += item;
                });

                // --- Dados para o Gráfico ---
                const spendingByMonth = {};
                refuels.forEach(r => {
                    const monthKey = r.date.substring(0, 7); // 'YYYY-MM'
                    spendingByMonth[monthKey] = (spendingByMonth[monthKey] || 0) + r.totalValue;
                });

                const chartLabels = Object.keys(spendingByMonth).map(key => {
                    const [year, month] = key.split('-');
                    return new Date(year, month - 1).toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
                });
                const chartData = Object.values(spendingByMonth);

                // Atualiza ou cria o gráfico
                if (spendingChartInstance) {
                    spendingChartInstance.data.labels = chartLabels;
                    spendingChartInstance.data.datasets[0].data = chartData;
                    spendingChartInstance.update();
                } else {
                    spendingChartInstance = new Chart(spendingChartCanvas, {
                        type: 'bar',
                        data: {
                            labels: chartLabels,
                            datasets: [{
                                label: 'Gasto (R$)',
                                data: chartData,
                                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            }]
                        },
                        options: { responsive: true, maintainAspectRatio: false }
                    });
                }
            });
    };

    /**
     * Busca dados e atualiza a página de Estatísticas.
     */
    const updateStatisticsPage = () => {
        const user = auth.currentUser;
        if (!user) return;

        // Limpa gráficos antigos para evitar sobreposição
        if (consumptionChartInstance) consumptionChartInstance.destroy();
        if (monthlySpendingChartInstance) monthlySpendingChartInstance.destroy();
        if (fuelTypeChartInstance) fuelTypeChartInstance.destroy();
        if (mileageChartInstance) mileageChartInstance.destroy();

        // Mostra um estado de carregamento
        bestConsumptionEl.textContent = '...';
        worstConsumptionEl.textContent = '...';
        mostUsedStationEl.textContent = '...';

        db.collection('refuels')
            .where('userId', '==', user.uid)
            .orderBy('date', 'asc')
            .get()
            .then(querySnapshot => {
                const allChartContainers = statsContent.querySelectorAll('.chart-container');

                // Verifica se há dados suficientes
                if (querySnapshot.docs.length < 2) {
                    statsPlaceholder.classList.remove('d-none');
                    allChartContainers.forEach(c => c.style.display = 'none');
                    bestConsumptionEl.textContent = 'N/A';
                    worstConsumptionEl.textContent = 'N/A';
                    mostUsedStationEl.textContent = 'N/A';
                    return;
                }

                statsPlaceholder.classList.add('d-none');
                allChartContainers.forEach(c => c.style.display = 'block');

                const refuels = querySnapshot.docs.map(doc => doc.data());

                // --- Cálculos para os Cards ---
                const consumptions = [];
                refuels.forEach((current, index) => {
                    if (index < refuels.length - 1) {
                        const next = refuels[index + 1];
                        const km = next.mileage - current.mileage;
                        if (km > 0 && current.liters > 0) {
                            consumptions.push({
                                value: km / current.liters,
                                date: next.date,
                                gasStation: next.gasStation || 'Não informado'
                            });
                        }
                    }
                });

                if (consumptions.length > 0) {
                    const best = consumptions.reduce((max, c) => c.value > max.value ? c : max, consumptions[0]);
                    const worst = consumptions.reduce((min, c) => c.value < min.value ? c : min, consumptions[0]);
                    bestConsumptionEl.textContent = `${best.value.toFixed(1).replace('.', ',')} km/L`;
                    bestConsumptionDetailsEl.textContent = `${best.gasStation} - ${new Date(best.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`;
                    worstConsumptionEl.textContent = `${worst.value.toFixed(1).replace('.', ',')} km/L`;
                    worstConsumptionDetailsEl.textContent = `${worst.gasStation} - ${new Date(worst.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`;
                }

                const stationCounts = refuels.reduce((acc, r) => {
                    if (r.gasStation) acc[r.gasStation] = (acc[r.gasStation] || 0) + 1;
                    return acc;
                }, {});
                const mostUsed = Object.entries(stationCounts).sort((a, b) => b[1] - a[1])[0];
                if (mostUsed) {
                    mostUsedStationEl.textContent = mostUsed[0];
                    mostUsedStationDetailsEl.textContent = `${mostUsed[1]} abastecimento(s)`;
                }

                // --- Funções para renderizar gráficos ---
                const renderChart = (canvas, config) => new Chart(canvas, config);

                // Gráfico 1: Consumo Médio por Mês
                const consumptionByMonth = consumptions.reduce((acc, c) => {
                    const monthKey = c.date.substring(0, 7);
                    if (!acc[monthKey]) acc[monthKey] = [];
                    acc[monthKey].push(c.value);
                    return acc;
                }, {});
                const avgConsumptionByMonth = Object.entries(consumptionByMonth).reduce((acc, [key, values]) => {
                    acc[key] = values.reduce((a, b) => a + b, 0) / values.length;
                    return acc;
                }, {});
                consumptionChartInstance = renderChart(consumptionChartCanvas, {
                    type: 'line',
                    data: {
                        labels: Object.keys(avgConsumptionByMonth).map(k => new Date(k + '-02').toLocaleString('pt-BR', { month: 'short', year: '2-digit' })),
                        datasets: [{ label: 'Consumo (km/L)', data: Object.values(avgConsumptionByMonth), borderColor: 'rgba(54, 162, 235, 1)', tension: 0.1 }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });

                // Gráfico 2: Gastos Mensais (similar ao do dashboard)
                const spendingByMonth = refuels.reduce((acc, r) => {
                    const monthKey = r.date.substring(0, 7);
                    acc[monthKey] = (acc[monthKey] || 0) + r.totalValue;
                    return acc;
                }, {});
                monthlySpendingChartInstance = renderChart(monthlySpendingChartCanvas, {
                    type: 'bar',
                    data: {
                        labels: Object.keys(spendingByMonth).map(k => new Date(k + '-02').toLocaleString('pt-BR', { month: 'short', year: '2-digit' })),
                        datasets: [{ label: 'Gasto (R$)', data: Object.values(spendingByMonth), backgroundColor: 'rgba(255, 99, 132, 0.6)' }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });

                // Gráfico 3: Distribuição por Tipo de Combustível (gasto)
                const spendingByFuelType = refuels.reduce((acc, r) => {
                    const type = r.fuelType.charAt(0).toUpperCase() + r.fuelType.slice(1);
                    acc[type] = (acc[type] || 0) + r.totalValue;
                    return acc;
                }, {});
                fuelTypeChartInstance = renderChart(fuelTypeChartCanvas, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(spendingByFuelType),
                        datasets: [{ data: Object.values(spendingByFuelType), backgroundColor: ['#FFC107', '#198754', '#6F42C1', '#FD7E14'] }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });

                // Gráfico 4: Quilometragem Acumulada
                mileageChartInstance = renderChart(mileageChartCanvas, {
                    type: 'line',
                    data: {
                        labels: refuels.map(r => new Date(r.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })),
                        datasets: [{ label: 'Quilometragem (km)', data: refuels.map(r => r.mileage), borderColor: 'rgba(40, 167, 69, 1)', fill: false }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            });
    };

    // Não é mais necessário atualizar UI de paginação

    /**
     * Busca e exibe os 20 registros mais recentes do histórico de abastecimentos do usuário logado.
     */
    const fetchAndDisplayHistory = () => {
        const user = auth.currentUser;
        if (!user) {
            historyTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Faça login para ver seu histórico.</td></tr>';
            return;
        }

        // Exibe um indicador de carregamento
        historyTableBody.innerHTML = '<tr><td colspan="8" class="text-center"><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Carregando...</span></div></td></tr>';

        let query = db.collection('refuels').where('userId', '==', user.uid);

        // Aplica filtros, se desejar (mantendo compatibilidade com filtros existentes)
        const filters = getFilters();
        if (filters.startDate) {
            query = query.where('date', '>=', filters.startDate);
        }
        if (filters.endDate) {
            query = query.where('date', '<=', filters.endDate);
        }
        if (filters.fuelType) {
            query = query.where('fuelType', '==', filters.fuelType);
        }

        // Ordena e limita aos 20 mais recentes
        query.orderBy('date', 'desc').orderBy('createdAt', 'desc').limit(20).get()
            .then(querySnapshot => {
                historyTableBody.innerHTML = '';

                if (querySnapshot.empty) {
                    historyTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum abastecimento registrado ainda.</td></tr>';
                    return;
                }

                const allFetchedRefuels = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Inicializa todos como 'N/A'
                allFetchedRefuels.forEach(refuel => {
                    refuel.consumption = 'N/A';
                });

                // Calcula o consumo para cada abastecimento (olhando para o próximo)
                allFetchedRefuels.forEach((currentRefuel, index) => {
                    if (index < allFetchedRefuels.length - 1) {
                        const previousRefuelInTime = allFetchedRefuels[index + 1];
                        const kmTraveled = currentRefuel.mileage - previousRefuelInTime.mileage;
                        if (kmTraveled > 0 && previousRefuelInTime.liters > 0) {
                            const calculatedConsumption = (kmTraveled / previousRefuelInTime.liters).toFixed(2);
                            previousRefuelInTime.consumption = `${calculatedConsumption.replace('.', ',')} km/l`;
                        }
                    }
                });

                // O registro mais recente (primeiro da lista) deve ser 'N/A'.
                if (allFetchedRefuels.length > 0) {
                    allFetchedRefuels[0].consumption = 'N/A';
                }

                // Renderiza a tabela
                allFetchedRefuels.forEach(data => {
                    const docId = data.id;
                    const row = document.createElement('tr');
                    // Formata a data para o padrão brasileiro, corrigindo problemas de fuso horário
                    const formattedDate = new Date(data.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

                    row.innerHTML = `
                        <td>${formattedDate}</td>
                        <td>${data.mileage.toLocaleString('pt-BR')}</td>
                        <td>${data.liters.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>R$ ${data.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>R$ ${data.pricePerLiter.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>${data.consumption}</td>
                        <td>${data.gasStation || '-'}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${docId}" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${docId}" title="Excluir">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
                    historyTableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error("Erro ao buscar histórico: ", error);
                historyTableBody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Erro ao carregar o histórico. Tente novamente mais tarde.</td></tr>';
                showToast('Erro ao carregar o histórico.', 'danger');
            });
    };

    const getFilters = () => {
        const filters = {
            startDate: filterDateStartInput.value,
            endDate: filterDateEndInput.value,
            fuelType: filterFuelTypeInput.value,
        };
        // Remove chaves vazias para não enviar filtros em branco
        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });
        return filters;
    };

    /**
     * Event listener para o botão de aplicar filtros.
     */
    applyFiltersBtn.addEventListener('click', () => {
        fetchAndDisplayHistory();
    });
    // Removido: listeners de paginação, pois não há mais paginação
    /**
     * Delegação de eventos para os botões de editar e excluir na tabela de histórico.
     */
    historyTableBody.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const docId = target.dataset.id;

        if (target.classList.contains('delete-btn')) {
            // Armazena o ID no botão de confirmação e abre o modal
            confirmDeleteBtn.dataset.id = docId;
            deleteConfirmModal.show();
        }

        if (target.classList.contains('edit-btn')) {
            // Busca os dados do documento para preencher o formulário de edição
            db.collection('refuels').doc(docId).get()
                .then(doc => {
                    if (doc.exists) {
                        const data = doc.data();
                        // Preenche o formulário no modal de edição
                        editDocIdInput.value = docId;
                        document.getElementById('edit-refuel-date').value = data.date;
                        document.getElementById('edit-fuel-type').value = data.fuelType;
                        document.getElementById('edit-mileage').value = data.mileage;
                        editLitersInput.value = data.liters;
                        editTotalValueInput.value = data.totalValue;
                        editPricePerLiterInput.value = data.pricePerLiter;
                        document.getElementById('edit-gas-station').value = data.gasStation;
                        document.getElementById('edit-observations').value = data.observations;
                        editRefuelModal.show();
                    } else {
                        showToast('Registro não encontrado.', 'danger');
                    }
                })
                .catch(error => {
                    console.error("Erro ao buscar documento para edição: ", error);
                    showToast('Erro ao carregar dados para edição.', 'danger');
                });
        }
    });

    /**
     * Event listener para o botão de confirmação de exclusão.
     */
    confirmDeleteBtn.addEventListener('click', () => {
        const docId = confirmDeleteBtn.dataset.id;
        db.collection('refuels').doc(docId).delete()
            .then(() => {
                showToast('Registro excluído com sucesso!', 'success');
                deleteConfirmModal.hide();
                fetchAndDisplayHistory({ direction: 'first', filters: getFilters() }); // Recarrega a partir da primeira página
            })
            .catch(error => {
                console.error("Erro ao excluir documento: ", error);
                showToast('Erro ao excluir o registro.', 'danger');
                deleteConfirmModal.hide();
            });
    });

    /**
     * Event listener para o formulário de edição.
     */
    editRefuelForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const docId = editDocIdInput.value;

        const updatedData = {
            date: document.getElementById('edit-refuel-date').value,
            fuelType: document.getElementById('edit-fuel-type').value,
            mileage: parseInt(document.getElementById('edit-mileage').value, 10),
            liters: parseFloat(editLitersInput.value),
            totalValue: parseFloat(editTotalValueInput.value),
            pricePerLiter: parseFloat(editPricePerLiterInput.value),
            gasStation: document.getElementById('edit-gas-station').value.trim(),
            observations: document.getElementById('edit-observations').value.trim(),
        };

        db.collection('refuels').doc(docId).update(updatedData)
            .then(() => {
                showToast('Registro atualizado com sucesso!', 'success');
                editRefuelModal.hide();
                fetchAndDisplayHistory({ direction: 'first', filters: getFilters() }); // Recarrega a partir da primeira página
            })
            .catch(error => {
                console.error("Erro ao atualizar documento: ", error);
                showToast('Erro ao atualizar o registro.', 'danger');
            });
    });

    // Adiciona cálculo automático de preço/litro também no formulário de edição
    const calculateEditPricePerLiter = () => {
        const total = parseFloat(editTotalValueInput.value);
        const liters = parseFloat(editLitersInput.value);
        editPricePerLiterInput.value = (total > 0 && liters > 0) ? (total / liters).toFixed(2) : '';
    };
    editTotalValueInput.addEventListener('input', calculateEditPricePerLiter);
    editLitersInput.addEventListener('input', calculateEditPricePerLiter);

    // --- Lógica da Interface (UI) ---

    /**
     * Alternar visibilidade da senha
     */
    togglePasswordBtn.addEventListener('click', () => {
        const icon = togglePasswordBtn.querySelector('i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    });

    /**
     * Alternar entre tela de Login e Criação de Conta
     */
    createAccountLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginPage.classList.add('d-none');
        createAccountPage.classList.remove('d-none');
    });

    backToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        createAccountPage.classList.add('d-none');
        loginPage.classList.remove('d-none');
    });

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordModal.show();
    });

    /**
     * Navegação entre as páginas do Dashboard
     */
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
    const contentPages = document.querySelectorAll('.page-content');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove a classe 'active' de todos os links e páginas
            sidebarLinks.forEach(l => l.classList.remove('active'));
            contentPages.forEach(p => p.classList.remove('active-page'));

            // Adiciona a classe 'active' ao link clicado
            link.classList.add('active');

            // Mostra a página de conteúdo correspondente
            const page = link.getAttribute('data-page');
            const targetPage = document.getElementById(`${page}-content`);
            if (targetPage) {
                targetPage.classList.add('active-page');
            }

            // Se a página clicada for o histórico, busca os dados
            if (page === 'history') {
                // Limpa os filtros e busca a lista completa
                filterDateStartInput.value = '';
                filterDateEndInput.value = '';
                filterFuelTypeInput.value = '';
                fetchAndDisplayHistory(); // Busca sem filtros
            }
            // Se a página clicada for o dashboard, atualiza os dados
            if (page === 'dashboard') {
                updateDashboard();
            }
            // Se a página clicada for as estatísticas, atualiza os dados
            if (page === 'statistics') {
                updateStatisticsPage();
            }
        });
    });

    /**
     * Cálculo automático do preço por litro
     */
    const totalValueInput = document.getElementById('total-value');
    const litersInput = document.getElementById('liters');
    const pricePerLiterInput = document.getElementById('price-per-liter');

    const calculatePricePerLiter = () => {
        const total = parseFloat(totalValueInput.value);
        const liters = parseFloat(litersInput.value);

        if (total > 0 && liters > 0) {
            const pricePerLiter = total / liters;
            pricePerLiterInput.value = pricePerLiter.toFixed(2);
        } else {
            pricePerLiterInput.value = '';
        }
    };

    totalValueInput.addEventListener('input', calculatePricePerLiter);
    litersInput.addEventListener('input', calculatePricePerLiter);
});