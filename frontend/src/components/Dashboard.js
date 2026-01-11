export default {
  name: 'Dashboard',
  
  template: `
    <div class="dashboard">
      <h1>Dashboard Financeiro</h1>
      
      <!-- Cards de Resumo -->
      <div class="grid-container">
        <div class="grid-item">
          <div class="card">
            <h3>Saldo Total</h3>
            <div class="text-center mt-20">
              <h2 :class="balance >= 0 ? 'text-success' : 'text-danger'">
                R$ {{ balance.toFixed(2) }}
              </h2>
            </div>
          </div>
        </div>
        
        <!-- Outros cards -->
      </div>
    </div>
  `,
  
  props: {
    transactions: {
      type: Array,
      required: true
    },
    goals: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  
  data() {
    return {
      // Dados locais do componente
      localData: 'exemplo'
    };
  },
  
  computed: {
    totalIncome() {
      return this.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    },
    
    totalExpense() {
      return this.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    },
    
    balance() {
      return this.totalIncome - this.totalExpense;
    }
  },
  
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    }
  },
  
  mounted() {
    console.log('Dashboard component montado');
  }
};