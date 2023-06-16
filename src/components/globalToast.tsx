import { useToast } from '@chakra-ui/react';

export const CustomToast = () => {
  const toast = useToast();
  // types are: "success", "info", "warning", "error"

  const addToast = (newRes: any) => {
    if (!toast.isActive(newRes.id)) {
      toast({
        id: newRes.id,
        title: newRes.message,
        status: newRes.type,
        position: 'top-left',
        isClosable: true,
        duration: 2000,
        variant: 'solid',
      });
    }
  };

  return { addToast };
};
