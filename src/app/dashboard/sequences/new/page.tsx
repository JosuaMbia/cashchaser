"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SequenceStep {
  order: number;
  type: "EMAIL" | "SMS";
  delayDays: number;
  subject?: string;
  content: string;
}

export default function NewSequencePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<SequenceStep[]>([
    {
      order: 1,
      type: "EMAIL",
      delayDays: 0,
      subject: "",
      content: "",
    },
  ]);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        order: steps.length + 1,
        type: "EMAIL",
        delayDays: 7,
        subject: "",
        content: "",
      },
    ]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps.map((step, i) => ({ ...step, order: i + 1 })));
  };

  const updateStep = (
    index: number,
    field: keyof SequenceStep,
    value: string | number
  ) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          steps,
        }),
      });

      if (!response.ok) throw new Error("Failed to create sequence");

      router.push("/dashboard/sequences");
    } catch (error) {
      console.error("Error creating sequence:", error);
      alert("Erreur lors de la création de la séquence");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link
          href="/dashboard/sequences"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Retour aux séquences
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nouvelle séquence</h1>
        <p className="text-gray-600 mt-2">
          Configurez une séquence de relance automatique
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Informations de base */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Informations de base</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la séquence *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Relance standard 30 jours"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Description de la séquence"
              />
            </div>
          </div>
        </div>

        {/* Étapes de relance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Étapes de relance</h2>
            <button
              type="button"
              onClick={addStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              + Ajouter une étape
            </button>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 relative"
              >
                <div className="absolute top-4 left-4 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  {step.order}
                </div>

                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}

                <div className="ml-12 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de message *
                      </label>
                      <select
                        value={step.type}
                        onChange={(e) =>
                          updateStep(index, "type", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="EMAIL">Email</option>
                        <option value="SMS">SMS</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Délai (jours) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={step.delayDays}
                        onChange={(e) =>
                          updateStep(index, "delayDays", parseInt(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {step.type === "EMAIL" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Objet de l'email *
                      </label>
                      <input
                        type="text"
                        value={step.subject || ""}
                        onChange={(e) =>
                          updateStep(index, "subject", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Rappel facture {{invoice_number}}"
                        required={step.type === "EMAIL"}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      value={step.content}
                      onChange={(e) =>
                        updateStep(index, "content", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={step.type === "EMAIL" ? 6 : 3}
                      placeholder={
                        step.type === "EMAIL"
                          ? "Bonjour {{client_name}},\n\nNous vous rappelons que la facture {{invoice_number}} d'un montant de {{amount}}€ est en attente de paiement.\n\nMerci de régulariser votre situation."
                          : "Bonjour, votre facture {{invoice_number}} de {{amount}}€ est en attente. Merci de payer rapidement."
                      }
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                                          Variables disponibles: {'{{client_name}}'}, {'{{invoice_number}}'}, {'{{amount}}'}, {'{{due_date}}'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/dashboard/sequences"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Création..." : "Créer la séquence"}
          </button>
        </div>
      </form>
    </div>
  );
}
