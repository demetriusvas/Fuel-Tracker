document.addEventListener('DOMContentLoaded', () => {
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
    const loginLoadingSpinner = document.getElementById('login-loading');
    const togglePasswordBtn = document.getElementById('toggle-password');

    // Toast de notificação
    const toastElement = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toast = new bootstrap.Toast(toastElement);

    // --- Funções Auxiliares ---

    /**
     * Exibe o spinner de carregamento e desabilita o formulário.
     * @param {boolean} isLoading - True para mostrar, false para esconder.
     */
    const setLoading = (isLoading) => {
        loginLoadingSpinner.style.display = isLoading ? 'block' : 'none';
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
            dashboardPage.classList.remove('d-none');
            userNameSpan.textContent = user.displayName || user.email.split('@')[0];
        } else {
            // Usuário está deslogado
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