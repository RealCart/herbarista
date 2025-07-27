document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.checkout-section .tabs__btn');
    const individualPaymentOptions = document.querySelector('.payment-options_individual');
    const legalPaymentOptions = document.querySelector('.payment-options_legal');

    if (tabs.length > 0 && individualPaymentOptions && legalPaymentOptions) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const isIndividual = tab.textContent.trim() === 'Физическое лицо';
                
                if (isIndividual) {
                    individualPaymentOptions.style.display = 'flex';
                    legalPaymentOptions.style.display = 'none';
                } else {
                    individualPaymentOptions.style.display = 'none';
                    legalPaymentOptions.style.display = 'flex';
                }
            });
        });

        if (tabs[0].classList.contains('tabs__btn_active')) {
            individualPaymentOptions.style.display = 'flex';
            legalPaymentOptions.style.display = 'none';
        } else {
            individualPaymentOptions.style.display = 'none';
            legalPaymentOptions.style.display = 'flex';
        }
    }
}); 