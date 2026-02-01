// Auto-start processing when reaching step 8
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentStep === 8) {
      // Reset states when entering step 8
      setIsProcessing(true);
      setProcessingStep(0);
      
      let step = 0;
      interval = setInterval(() => {
        step++;
        if (step < processingSteps.length) {
          setProcessingStep(step);
        }
        
        if (step >= processingSteps.length) {
          clearInterval(interval);
          // Pequeno delay para o usuário ver o último check de conclusão
          setTimeout(() => {
            generateCV();
            setIsProcessing(false);
            setCurrentStep(9); // Avança automaticamente para o resultado
          }, 800);
        }
      }, 1000); // 1 segundo por etapa de "análise"
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep]);
