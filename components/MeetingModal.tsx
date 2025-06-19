import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  image?: string;
  buttonIcon?: string;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  children,
  handleClick,
  buttonText,
  image,
  buttonIcon,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="image" width={72} height={72} />
            </div>
          )}
          <DialogHeader className="text-center">
            <DialogTitle className={cn('text-3xl font-bold leading-[42px] flex items-center justify-center')}>
              {title}
            </DialogTitle>
          </DialogHeader>
          {children}
          <Button 
            className="bg-blue-600 focus-visible:ring-0 focus-visible:ring-offset-0 w-full justify-center gap-2" 
            onClick={handleClick}
          >
            {buttonIcon && (
              <Image 
                src={buttonIcon} 
                alt="button icon" 
                width={16} 
                height={16}
              />
            )}
            <span className="text-center">
              {buttonText || 'Schedule Meeting'}
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;