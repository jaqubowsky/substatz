"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { AddSubscriptionForm } from "./add-subscription-form";

export const AddSubscriptionButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button onClick={openModal} variant="default" className="gap-1">
        <PlusCircle className="h-4 w-4" />
        Add Subscription
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Add New Subscription"
      >
        <AddSubscriptionForm onSuccess={closeModal} />
      </Modal>
    </>
  );
};
