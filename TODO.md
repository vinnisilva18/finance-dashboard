# TODO - Correções no Finance Dashboard

## Problemas Identificados
1. Login não salvando credencial - Porta da API incorreta (3000 ao invés de 3001)
2. Tela de login presa após logar - Falha nas chamadas de API
3. Transações não salvando no banco - API não funcionando
4. Logout preso no sidebar - Estado não atualizando

## Correções Necessárias
- [x] Ajustar porta da API no frontend (3000 -> 3001)
- [x] Corrigir bug no auth store (remover apiService.defaults inválido)
- [ ] Iniciar backend
- [ ] Testar login e logout
- [ ] Testar criação de transações
