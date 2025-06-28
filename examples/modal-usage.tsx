import React, { useState } from 'react';
import { InscriptionModal } from '../src/components/InscriptionViewer';
import { Button } from '../src/components/ui/button';

const ModalUsageExample: React.FC = () => {
  const [customModalOpen, setCustomModalOpen] = useState(false);

  const sampleInscription = {
    id: 'dca3da701a2607de6c89dd0bfe6106532dcefe279d13b105301a2d85eb4ffaafi0',
    number: '1'
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Modal Usage Example</h1>
      <p className="text-gray-600 mb-6">
        Examples of using the InscriptionModal component in different ways.
      </p>
      
      <div className="space-y-6">
        {/* Default Modal Button */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Default Modal Button</h3>
          <InscriptionModal
            inscriptionId={sampleInscription.id}
            inscriptionNumber={sampleInscription.number}
            modalSize="lg"
            showTriggerButton={true}
          />
        </div>

        {/* Custom Trigger Button */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Custom Trigger Button</h3>
          <InscriptionModal
            inscriptionId={sampleInscription.id}
            inscriptionNumber={sampleInscription.number}
            modalSize="xl"
            trigger={
              <Button variant="outline" size="lg">
                🖼️ View Inscription Art
              </Button>
            }
          />
        </div>

        {/* Different Modal Sizes */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Different Modal Sizes</h3>
          <div className="flex gap-2 flex-wrap">
            <InscriptionModal
              inscriptionId={sampleInscription.id}
              inscriptionNumber={sampleInscription.number}
              modalSize="sm"
              trigger={<Button size="sm">Small</Button>}
            />
            <InscriptionModal
              inscriptionId={sampleInscription.id}
              inscriptionNumber={sampleInscription.number}
              modalSize="md"
              trigger={<Button size="sm">Medium</Button>}
            />
            <InscriptionModal
              inscriptionId={sampleInscription.id}
              inscriptionNumber={sampleInscription.number}
              modalSize="lg"
              trigger={<Button size="sm">Large</Button>}
            />
            <InscriptionModal
              inscriptionId={sampleInscription.id}
              inscriptionNumber={sampleInscription.number}
              modalSize="xl"
              trigger={<Button size="sm">Extra Large</Button>}
            />
            <InscriptionModal
              inscriptionId={sampleInscription.id}
              inscriptionNumber={sampleInscription.number}
              modalSize="full"
              trigger={<Button size="sm">Full Screen</Button>}
            />
          </div>
        </div>

        {/* Text Link Trigger */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Text Link Trigger</h3>
          <p className="text-gray-600">
            You can view the{' '}
            <InscriptionModal
              inscriptionId={sampleInscription.id}
              inscriptionNumber={sampleInscription.number}
              modalSize="lg"
              trigger={
                <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                  first Bitcoin inscription
                </span>
              }
            />{' '}
            in a modal overlay.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModalUsageExample;
