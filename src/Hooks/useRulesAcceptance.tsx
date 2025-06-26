import { useEffect, useState } from 'react';
import { LegalTextService } from '../core/legals/LegalTextService';

interface UseRulesAcceptanceReturn {
    showRulesModal: boolean;
    rulesAccepted: boolean;
    canProceed: boolean;
    showModal: () => void;
    hideModal: () => void;
    toggleAcceptance: () => void;
    resetAcceptance: () => void;
}

export const useRulesAcceptance = (autoShowOnMount: boolean = true): UseRulesAcceptanceReturn => {
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [rulesAccepted, setRulesAccepted] = useState(false);
    const [canProceed, setCanProceed] = useState(false);

    useEffect(() => {
        const checkRulesAcceptance = async () => {
            try {
                // Check if user has previously accepted rules
                const previouslyAccepted = localStorage.getItem('rulesAccepted');
                const acceptedDate = localStorage.getItem('rulesAcceptedDate');

                if (previouslyAccepted === 'true' && acceptedDate) {
                    // Check if rules have been updated since user last accepted them
                    const legalTextService = new LegalTextService();
                    const currentRules = await legalTextService.getLegalTextByType('blog-rules');

                    const userAcceptedDate = new Date(acceptedDate);
                    const rulesUpdatedDate = currentRules.updatedAt ? new Date(currentRules.updatedAt) : new Date();

                    // If rules were updated after user accepted them, show modal again
                    if (rulesUpdatedDate > userAcceptedDate) {
                        if (autoShowOnMount) {
                            setShowRulesModal(true);
                        }
                        setCanProceed(false);
                    } else {
                        // Rules haven't changed, user can proceed
                        setRulesAccepted(true);
                        setCanProceed(true);
                        setShowRulesModal(false);
                    }
                } else {
                    // User hasn't accepted rules yet
                    if (autoShowOnMount) {
                        setShowRulesModal(true);
                    }
                }
            } catch (error) {
                console.error('Error checking rules acceptance:', error);
                // If there's an error, show the modal to be safe
                if (autoShowOnMount) {
                    setShowRulesModal(true);
                }
            }
        };

        checkRulesAcceptance();
    }, [autoShowOnMount]);

    const showModal = () => {
        setShowRulesModal(true);
    };

    const hideModal = () => {
        if (rulesAccepted) {
            setCanProceed(true);
            // Store acceptance in localStorage
            localStorage.setItem('rulesAccepted', 'true');
            localStorage.setItem('rulesAcceptedDate', new Date().toISOString());
        }
        setShowRulesModal(false);
    };

    const toggleAcceptance = () => {
        setRulesAccepted(!rulesAccepted);
    };

    const resetAcceptance = () => {
        setRulesAccepted(false);
        setCanProceed(false);
        localStorage.removeItem('rulesAccepted');
        localStorage.removeItem('rulesAcceptedDate');
    };

    return {
        showRulesModal,
        rulesAccepted,
        canProceed,
        showModal,
        hideModal,
        toggleAcceptance,
        resetAcceptance,
    };
};
