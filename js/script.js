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
     * Busca e exibe o histórico de abastecimentos do usuário logado.
     */
    const fetchAndDisplayHistory = () => {
        const user = auth.currentUser;
        if (!user) {
            historyTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Faça login para ver seu histórico.</td></tr>';
            return;
        }

        // Exibe um indicador de carregamento
        historyTableBody.innerHTML = '<tr><td colspan="8" class="text-center"><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Carregando...</span></div></td></tr>';

        db.collection('refuels')
            .where('userId', '==', user.uid) // Filtra apenas os registros do usuário logado
            .orderBy('date', 'asc') // Ordena do mais antigo para o mais novo para calcular
            .orderBy('createdAt', 'asc') // Critério de desempate para datas iguais
            .get()
            .then(querySnapshot => {
                historyTableBody.innerHTML = ''; // Limpa a tabela antes de adicionar os novos dados
 
                if (querySnapshot.empty) {
                    historyTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum abastecimento registrado ainda.</td></tr>';
                    return;
                }
 
                // Converte os documentos para um array para facilitar o acesso ao item anterior
                const refuels = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
 
                refuels.forEach((data, index) => {
                    const docId = data.id;
                    let consumption = 'N/A'; // Valor padrão
 
                    // Calcula o consumo a partir do segundo registro
                    if (index > 0) {
                        const previousRefuel = refuels[index - 1];
                        const kmTraveled = data.mileage - previousRefuel.mileage;
 
                        // Garante que o cálculo é válido (km rodados e litros do abastecimento ANTERIOR > 0)
                        if (kmTraveled > 0 && previousRefuel.liters > 0) {
                            const calculatedConsumption = (kmTraveled / previousRefuel.liters).toFixed(2);
                            consumption = `${calculatedConsumption.replace('.', ',')} km/l`;
                        }
                    }
 
                    const row = document.createElement('tr');
                    // Formata a data para o padrão brasileiro, corrigindo problemas de fuso horário
                    const formattedDate = new Date(data.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
 
                    row.innerHTML = `
                        <td>${formattedDate}</td>
                        <td>${data.mileage.toLocaleString('pt-BR')}</td>
                        <td>${data.liters.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>R$ ${data.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>R$ ${data.pricePerLiter.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>${consumption}</td>
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
                    // Adiciona a linha no início da tabela para manter a ordem de "mais novo primeiro"
                    historyTableBody.prepend(row);
                });
            })
            .catch(error => {
                console.error("Erro ao buscar histórico: ", error);
                historyTableBody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Erro ao carregar o histórico. Tente novamente mais tarde.</td></tr>';
                showToast('Erro ao carregar o histórico.', 'danger');
            });
    };

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
                fetchAndDisplayHistory(); // Atualiza a tabela
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
                fetchAndDisplayHistory(); // Atualiza a tabela
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
                fetchAndDisplayHistory();
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