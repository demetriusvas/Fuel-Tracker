// Simulação de dados
        const mockRefuels = [
            {
                id: 1,
                date: "2023-06-15",
                mileage: 45200,
                liters: 20.00,
                totalValue: 250.00,
                pricePerLiter: 12.50,
                consumption: 12.5,
                fuelType: "gasolina",
                station: "Posto Central",
                observations: ""
            },
            {
                id: 2,
                date: "2023-06-10",
                mileage: 44900,
                liters: 15.00,
                totalValue: 180.00,
                pricePerLiter: 12.00,
                consumption: 13.3,
                fuelType: "etanol",
                station: "Auto Posto XYZ",
                observations: ""
            },
            {
                id: 3,
                date: "2023-06-05",
                mileage: 44500,
                liters: 25.00,
                totalValue: 320.00,
                pricePerLiter: 12.80,
                consumption: 11.8,
                fuelType: "diesel",
                station: "Shell Express",
                observations: ""
            }
        ];
        
        // Estado da aplicação
        let currentUser = null;
        let refuels = [...mockRefuels];
        
        // Elementos DOM
        const loginPage = document.getElementById('login-page');
        const dashboardPage = document.getElementById('dashboard-page');
        const loginForm = document.getElementById('login-form');
        const loginLoading = document.getElementById('login-loading');
        const logoutBtn = document.getElementById('logout-btn');
        const userName = document.getElementById('user-name');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        // Navegação entre páginas
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                
                // Atualizar navegação ativa
                document.querySelectorAll('.nav-link').forEach(nav => {
                    nav.classList.remove('active');
                });
                this.classList.add('active');
                
                // Mostrar página correspondente
                document.querySelectorAll('.page-content').forEach(content => {
                    content.classList.remove('active-page');
                });
                
                document.getElementById(`${page}-content`).classList.add('active-page');
                
                // Se for a página de estatísticas, inicializar gráficos
                if (page === 'statistics') {
                    initCharts();
                }
            });
        });
        
        // Função para mostrar toast
        function showToast(message, type = 'success') {
            toastMessage.textContent = message;
            toast.className = `toast align-items-center text-white border-0 ${type === 'success' ? 'bg-success' : 'bg-danger'}`;
            const bsToast = new bootstrap.Toast(toast);
            bsToast.show();
        }
        
        // Função para simular login
        function simulateLogin(email, password) {
            return new Promise((resolve, reject) => {
                loginLoading.style.display = 'block';
                
                setTimeout(() => {
                    loginLoading.style.display = 'none';
                    if (email && password) {
                        currentUser = {
                            name: email.split('@')[0],
                            email: email
                        };
                        resolve(currentUser);
                    } else {
                        reject('Credenciais inválidas');
                    }
                }, 1500);
            });
        }
        
        // Evento de login
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const user = await simulateLogin(email, password);
                userName.textContent = user.name;
                loginPage.classList.add('d-none');
                dashboardPage.classList.remove('d-none');
                showToast('Login realizado com sucesso!');
            } catch (error) {
                showToast('Erro ao fazer login. Verifique suas credenciais.', 'error');
            }
        });
        
        // Login com Google (simulado)
        document.getElementById('google-login').addEventListener('click', function() {
            simulateLogin('usuario@gmail.com', '123456')
                .then(user => {
                    userName.textContent = user.name;
                    loginPage.classList.add('d-none');
                    dashboardPage.classList.remove('d-none');
                    showToast('Login com Google realizado com sucesso!');
                });
        });
        
        // Logout
        logoutBtn.addEventListener('click', function() {
            currentUser = null;
            dashboardPage.classList.add('d-none');
            loginPage.classList.remove('d-none');
            showToast('Você saiu da sua conta.');
        });
        
        // Toggle password visibility
        document.getElementById('toggle-password').addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
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
        
        // Calcular preço por litro
        document.getElementById('total-value').addEventListener('input', calculatePricePerLiter);
        document.getElementById('liters').addEventListener('input', calculatePricePerLiter);
        
        function calculatePricePerLiter() {
            const totalValue = parseFloat(document.getElementById('total-value').value) || 0;
            const liters = parseFloat(document.getElementById('liters').value) || 0;
            
            if (liters > 0) {
                const pricePerLiter = totalValue / liters;
                document.getElementById('price-per-liter').value = pricePerLiter.toFixed(2);
            } else {
                document.getElementById('price-per-liter').value = '';
            }
        }
        
        // Cancelar novo abastecimento
        document.getElementById('cancel-refuel').addEventListener('click', function() {
            document.querySelectorAll('.nav-link').forEach(nav => {
                nav.classList.remove('active');
            });
            document.querySelector('[data-page="dashboard"]').classList.add('active');
            
            document.querySelectorAll('.page-content').forEach(content => {
                content.classList.remove('active-page');
            });
            document.getElementById('dashboard-content').classList.add('active-page');
        });
        
        // Salvar novo abastecimento
        document.getElementById('refuel-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular salvamento
            showToast('Abastecimento salvo com sucesso!');
            
            // Resetar formulário
            this.reset();
            
            // Voltar para dashboard
            setTimeout(() => {
                document.querySelectorAll('.nav-link').forEach(nav => {
                    nav.classList.remove('active');
                });
                document.querySelector('[data-page="dashboard"]').classList.add('active');
                
                document.querySelectorAll('.page-content').forEach(content => {
                    content.classList.remove('active-page');
                });
                document.getElementById('dashboard-content').classList.add('active-page');
            }, 2000);
        });
        
        // Exportar CSV
        document.getElementById('export-csv').addEventListener('click', function() {
            showToast('Exportando dados para CSV...');
            // Simular exportação
            setTimeout(() => {
                showToast('Arquivo CSV exportado com sucesso!');
            }, 1500);
        });
        
        // Aplicar filtros
        document.getElementById('apply-filters').addEventListener('click', function() {
            showToast('Filtros aplicados com sucesso!');
        });
        
        // Inicializar gráficos
        function initCharts() {
            // Gráfico de gastos mensais (Dashboard)
            const spendingCtx = document.getElementById('spendingChart').getContext('2d');
            new Chart(spendingCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Gastos Mensais (R$)',
                        data: [380, 420, 390, 450, 410, 450],
                        backgroundColor: 'rgba(37, 99, 235, 0.7)',
                        borderColor: 'rgba(37, 99, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            
            // Gráfico de consumo médio por mês
            const consumptionCtx = document.getElementById('consumptionChart').getContext('2d');
            new Chart(consumptionCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Consumo Médio (km/L)',
                        data: [11.5, 12.2, 13.0, 12.8, 12.3, 12.5],
                        borderColor: 'rgba(16, 185, 129, 1)',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            
            // Gráfico de gastos mensais (Estatísticas)
            const monthlySpendingCtx = document.getElementById('monthlySpendingChart').getContext('2d');
            new Chart(monthlySpendingCtx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Gastos Mensais (R$)',
                        data: [380, 420, 390, 450, 410, 450],
                        backgroundColor: 'rgba(245, 158, 11, 0.7)',
                        borderColor: 'rgba(245, 158, 11, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            
            // Gráfico de distribuição por tipo de combustível
            const fuelTypeCtx = document.getElementById('fuelTypeChart').getContext('2d');
            new Chart(fuelTypeCtx, {
                type: 'pie',
                data: {
                    labels: ['Gasolina', 'Etanol', 'Diesel', 'GNV'],
                    datasets: [{
                        data: [45, 30, 20, 5],
                        backgroundColor: [
                            'rgba(37, 99, 235, 0.7)',
                            'rgba(16, 185, 129, 0.7)',
                            'rgba(245, 158, 11, 0.7)',
                            'rgba(14, 165, 233, 0.7)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            
            // Gráfico de quilometragem acumulada
            const mileageCtx = document.getElementById('mileageChart').getContext('2d');
            new Chart(mileageCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Quilometragem Acumulada (km)',
                        data: [42000, 42800, 43500, 44000, 44700, 45200],
                        borderColor: 'rgba(14, 165, 233, 1)',
                        backgroundColor: 'rgba(14, 165, 233, 0.2)',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
        
        // Inicializar quando o DOM estiver pronto
        document.addEventListener('DOMContentLoaded', function() {
            // Definir data atual como padrão
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('refuel-date').value = today;
            
            // Inicializar primeiro gráfico (Dashboard)
            initCharts();
        });