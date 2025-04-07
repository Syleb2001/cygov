import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, AlertTriangle, CheckCircle, XCircle, Shield, BarChart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { functions } from '../data/functions';
import { Requirement, Function, Category, Subcategory } from '../types';

// Fonction pour filtrer les requirements selon le niveau
function getRequirementsForLevel(requirements: Requirement[], cyfunLevel?: string): Requirement[] {
  if (!cyfunLevel) return [];
  
  switch (cyfunLevel) {
    case 'essential':
      return requirements.filter(req => 
        ['basic', 'important', 'essential'].includes(req.cyfunLevel)
      );
    case 'important':
      return requirements.filter(req => 
        req.cyfunLevel === 'basic' || req.cyfunLevel === 'important'
      );
    case 'basic':
    default:
      return requirements.filter(req => 
        req.cyfunLevel === 'basic'
      );
  }
}

// Structure pour stocker les niveaux de maturité
interface MaturityLevel {
  label: string;
  value: number;
  description: string;
}

// Définition des niveaux de maturité basés sur l'image
const maturityLevels: MaturityLevel[] = [
  { value: 1, label: "Initial", description: "No Process documentation or not formally approved by management." },
  { value: 2, label: "Repeatable", description: "Formally approved Process documentation exists but not reviewed in the previous 2 years." },
  { value: 3, label: "Defined", description: "Formally approved Process documentation exists, and exceptions are documented and approved. Documented & approved exceptions < 5% of the time." },
  { value: 4, label: "Managed", description: "Formally approved Process documentation exists, and exceptions are documented and approved. Documented & approved exceptions < 3% of the time." },
  { value: 5, label: "Optimizing", description: "Formally approved Process documentation exists, and exceptions are documented and approved. Documented & approved exceptions < 0.5% of the time." }
];

// Thresholds de maturité basés sur l'image
const maturityThresholds = {
  keyMeasure: {
    basic: 2.5,
    important: 3,
    essential: 3
  },
  category: {
    basic: "n/a",
    important: "n/a",
    essential: 3
  },
  total: {
    basic: 2.5,
    important: 3,
    essential: 3.5
  }
};

// Fonction pour obtenir le statut d'un requirement
function getStatusForRequirement(reqId: string, controlStatuses: Record<string, { userStatuses: Record<string, string> }>, userId?: string): string {
  if (!userId) return 'pending';
  
  // Check specific requirement status first
  const reqStatus = controlStatuses[reqId]?.userStatuses[userId];
  if (reqStatus) return reqStatus;
  
  // If no specific status, check parent control status
  const parentControlId = reqId.split('.').slice(0, -1).join('.');
  return controlStatuses[parentControlId]?.userStatuses[userId] || 'pending';
}

export default function Compliance() {
  const { user } = useAuth();
  const [controlStatuses, setControlStatuses] = useState<Record<string, { userStatuses: Record<string, string> }>>({});
  const [maturityScores, setMaturityScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLevel, setCurrentLevel] = useState(user?.cyfunLevel || 'basic');
  const [showMaturityModal, setShowMaturityModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [selectedMaturityLevel, setSelectedMaturityLevel] = useState<number>(1);
  const [overallMaturity, setOverallMaturity] = useState(0);
  const [functionMaturity, setFunctionMaturity] = useState<Record<string, number>>({});
  const [categoryMaturity, setCategoryMaturity] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les statuts des contrôles
        const controlsResponse = await fetch('/api/controls');
        if (!controlsResponse.ok) {
          throw new Error('Failed to fetch controls');
        }
        const controlsData = await controlsResponse.json();
        setControlStatuses(controlsData.controls || {});
        
        // Charger les scores de maturité pour l'utilisateur actuel
        if (user?.id) {
          const maturityResponse = await fetch(`/api/maturity?userId=${user.id}`);
          if (maturityResponse.ok) {
            const maturityData = await maturityResponse.json();
            setMaturityScores(maturityData.scores || {});
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  useEffect(() => {
    if (user?.cyfunLevel) {
      setCurrentLevel(user.cyfunLevel);
    }
  }, [user]);

  useEffect(() => {
    if (Object.keys(maturityScores).length > 0) {
      calculateMaturityScores();
    }
  }, [maturityScores, controlStatuses, currentLevel]);

  // Calculer les scores de maturité pour les fonctions et catégories
  const calculateMaturityScores = () => {
    let totalMaturitySum = 0;
    let totalRequirements = 0;
    const functionMaturityMap: Record<string, number> = {};
    const categoryMaturityMap: Record<string, number> = {};
    
    // Calculer pour chaque fonction
    functions.forEach(func => {
      let funcMaturitySum = 0;
      let funcRequirements = 0;
      
      // Calculer pour chaque catégorie
      func.categories.forEach(cat => {
        let catMaturitySum = 0;
        let catRequirements = 0;
        
        // Calculer pour chaque sous-catégorie
        cat.subcategories.forEach(subcat => {
          const requirements = getRequirementsForLevel(subcat.requirements, currentLevel);
          
          // Calculer pour chaque exigence
          requirements.forEach(req => {
            const maturityScore = maturityScores[req.id] || 1; // Défaut à 1 si non défini
            
            catMaturitySum += maturityScore;
            catRequirements++;
            funcMaturitySum += maturityScore;
            funcRequirements++;
            totalMaturitySum += maturityScore;
            totalRequirements++;
          });
        });
        
        // Calculer la maturité moyenne pour la catégorie
        if (catRequirements > 0) {
          categoryMaturityMap[cat.id] = parseFloat((catMaturitySum / catRequirements).toFixed(1));
        }
      });
      
      // Calculer la maturité moyenne pour la fonction
      if (funcRequirements > 0) {
        functionMaturityMap[func.id] = parseFloat((funcMaturitySum / funcRequirements).toFixed(1));
      }
    });
    
    // Calculer la maturité globale
    if (totalRequirements > 0) {
      setOverallMaturity(parseFloat((totalMaturitySum / totalRequirements).toFixed(1)));
    }
    
    setFunctionMaturity(functionMaturityMap);
    setCategoryMaturity(categoryMaturityMap);
  };

  // Mettre à jour le niveau de maturité d'une exigence
  const updateMaturityLevel = async (requirementId: string, level: number) => {
    try {
      const response = await fetch('/api/maturity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requirementId, 
          level,
          userId: user?.id 
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update maturity level');
      }
      
      // Mettre à jour localement
      setMaturityScores(prev => ({
        ...prev,
        [requirementId]: level
      }));
      
      // Fermer le modal
      setShowMaturityModal(false);
    } catch (error) {
      console.error('Error updating maturity level:', error);
      setError(error instanceof Error ? error.message : 'Failed to update maturity level');
    }
  };

  // Obtenir la couleur en fonction du niveau de maturité
  const getMaturityColor = (score: number, threshold: number) => {
    if (score >= threshold) return 'green';
    if (score >= threshold - 1) return 'yellow';
    return 'red';
  };

  // Afficher un libellé pour le niveau de maturité
  const getMaturityLabel = (score: number) => {
    const level = maturityLevels.find(l => l.value === Math.floor(score));
    return level ? level.label : 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading compliance assessment...</div>
      </div>
    );
  }

  // Déterminer le seuil de maturité basé sur le niveau de sécurité actuel
  const currentThreshold = maturityThresholds.total[currentLevel as keyof typeof maturityThresholds.total];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Maturity Assessment</h2>
            <p className="mt-1 text-sm text-gray-500">
              CyFun {user?.cyfunLevel} Level Maturity Status
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Maturity Level Explanation */}
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <h3 className="text-md font-medium text-blue-800 mb-2">Maturity Levels Explained</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {maturityLevels.map(level => (
                  <div key={level.value} className="bg-white p-3 rounded shadow-sm">
                    <h4 className="font-medium">{level.value}. {level.label}</h4>
                    <p className="text-xs text-gray-600 mt-1">{level.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-blue-700">
                <p>Thresholds for {currentLevel} level: Key Measures ≥ {maturityThresholds.keyMeasure[currentLevel as keyof typeof maturityThresholds.keyMeasure]}/5, Total ≥ {currentThreshold}/5</p>
              </div>
            </div>

            {/* Overall Maturity Score */}
            <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Overall Maturity Score</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Average maturity across all requirements
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${
                    getMaturityColor(overallMaturity, typeof currentThreshold === 'number' ? currentThreshold : 3) === 'green' 
                      ? 'text-green-600' 
                      : getMaturityColor(overallMaturity, typeof currentThreshold === 'number' ? currentThreshold : 3) === 'yellow' 
                      ? 'text-yellow-600' 
                      : 'text-red-600'
                  }`}>
                    {overallMaturity}/5
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {getMaturityLabel(Math.floor(overallMaturity))}
                  </div>
                </div>
              </div>

              {/* Maturity Gauge */}
              <div className="mt-6">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      getMaturityColor(overallMaturity, typeof currentThreshold === 'number' ? currentThreshold : 3) === 'green'
                        ? 'bg-green-500'
                        : getMaturityColor(overallMaturity, typeof currentThreshold === 'number' ? currentThreshold : 3) === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(overallMaturity / 5) * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-500">
                  <span>1. Initial</span>
                  <span>2. Repeatable</span>
                  <span>3. Defined</span>
                  <span>4. Managed</span>
                  <span>5. Optimizing</span>
                </div>
              </div>

              {/* Compliance Status Message */}
              <div className="mt-4 p-3 rounded-lg border text-center">
                {overallMaturity >= (typeof currentThreshold === 'number' ? currentThreshold : 3) ? (
                  <div className="text-green-600 font-medium flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Your organization is compliant with the CyFun {currentLevel} security level requirements
                  </div>
                ) : (
                  <div className="text-amber-600 font-medium flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Your organization needs to improve maturity score to meet CyFun {currentLevel} security level requirements
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  The required threshold for {currentLevel} level is ≥ {currentThreshold}/5
                </p>
              </div>
            </div>

            {/* Maturity by Function */}
            <h2 className="text-xl font-medium text-gray-900 mb-4">Maturity by Function</h2>
            <div className="grid grid-cols-1 gap-4">
              {functions.map(func => (
                <div key={func.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{func.name}</h3>
                      <p className="text-sm text-gray-500">
                        {func.id}: Maturity Level {functionMaturity[func.id] || 0}/5
                      </p>
                    </div>
                    <div className={`text-2xl font-bold ${
                      getMaturityColor(functionMaturity[func.id] || 0, typeof currentThreshold === 'number' ? currentThreshold : 3) === 'green' 
                        ? 'text-green-600' 
                        : getMaturityColor(functionMaturity[func.id] || 0, typeof currentThreshold === 'number' ? currentThreshold : 3) === 'yellow' 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {functionMaturity[func.id] || 0}
                    </div>
                  </div>
                  
                  {/* Category breakdowns for this function */}
                  <div className="mt-4 space-y-6">
                    {func.categories.map(cat => (
                      <div key={cat.id} className="bg-gray-50 p-4 rounded">
                        <div className="flex justify-between items-center mb-3">
                          <div>
                            <h4 className="text-md font-medium text-gray-800">{cat.name}</h4>
                            <p className="text-xs text-gray-500">
                              {cat.id}: Maturity Level {categoryMaturity[cat.id] || 0}/5
                            </p>
                          </div>
                          <div className={`text-sm font-medium ${
                            getMaturityColor(categoryMaturity[cat.id] || 0, typeof currentThreshold === 'number' ? currentThreshold : 3) === 'green' 
                              ? 'text-green-600' 
                              : getMaturityColor(categoryMaturity[cat.id] || 0, typeof currentThreshold === 'number' ? currentThreshold : 3) === 'yellow' 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                          }`}>
                            {categoryMaturity[cat.id] || 0}
                          </div>
                        </div>
                        
                        {/* Subcategories for this category */}
                        <div className="space-y-4 mt-3">
                          {cat.subcategories.map(subcat => (
                            <div key={subcat.id} className="bg-white p-3 rounded border border-gray-200">
                              <h5 className="font-medium text-sm text-gray-700 mb-2">{subcat.id}: {subcat.title}</h5>
                              
                              {/* Afficher tous les requirements, pas seulement ceux du niveau courant */}
                              <div className="space-y-3 ml-2">
                                {subcat.requirements.map(req => {
                                  const reqMaturity = maturityScores[req.id] || 1;
                                  const isLevelMatched = req.cyfunLevel === currentLevel || 
                                                          (currentLevel === 'important' && req.cyfunLevel === 'basic') ||
                                                          (currentLevel === 'essential' && ['basic', 'important'].includes(req.cyfunLevel));
                                  
                                  return (
                                    <div key={req.id} className={`border-b border-gray-100 pb-2 ${isLevelMatched ? '' : 'opacity-60'}`}>
                                      <div className="flex justify-between items-center">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-1">
                                            <p className="text-xs font-medium">{req.id}</p>
                                            {req.isKeyMeasure && (
                                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Key
                                              </span>
                                            )}
                                            <span className="text-xs px-1 py-0.5 bg-gray-100 rounded">
                                              {req.cyfunLevel}
                                            </span>
                                          </div>
                                          <p className="text-xs">{req.title}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <div className={`text-xs font-medium px-2 py-1 rounded ${
                                            getMaturityColor(reqMaturity, 
                                              req.isKeyMeasure 
                                                ? (maturityThresholds.keyMeasure[currentLevel as keyof typeof maturityThresholds.keyMeasure] as number) 
                                                : (typeof currentThreshold === 'number' ? currentThreshold : 3)
                                            ) === 'green' 
                                              ? 'bg-green-100 text-green-800' 
                                              : getMaturityColor(reqMaturity, 
                                                req.isKeyMeasure 
                                                  ? (maturityThresholds.keyMeasure[currentLevel as keyof typeof maturityThresholds.keyMeasure] as number) 
                                                  : (typeof currentThreshold === 'number' ? currentThreshold : 3)
                                              ) === 'yellow' 
                                              ? 'bg-yellow-100 text-yellow-800' 
                                              : 'bg-red-100 text-red-800'
                                          }`}>
                                            {reqMaturity}/5
                                          </div>
                                          <div className="flex">
                                            {[1, 2, 3, 4, 5].map(level => (
                                              <button
                                                key={`${req.id}-${level}`}
                                                onClick={() => updateMaturityLevel(req.id, level)}
                                                className={`w-6 h-6 flex items-center justify-center text-xs rounded-full ${
                                                  reqMaturity === level 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                              >
                                                {level}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour définir le niveau de maturité */}
      {showMaturityModal && selectedRequirement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Set Maturity Level for {selectedRequirement.id}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedRequirement.title}
            </p>

            <div className="space-y-3 mb-6">
              {maturityLevels.map(level => (
                <div 
                  key={level.value}
                  onClick={() => setSelectedMaturityLevel(level.value)}
                  className={`cursor-pointer p-3 rounded-lg border ${
                    selectedMaturityLevel === level.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      selectedMaturityLevel === level.value ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {level.value}
                    </div>
                    <div>
                      <h4 className="font-medium">{level.label}</h4>
                      <p className="text-xs text-gray-600 mt-1">{level.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowMaturityModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => updateMaturityLevel(selectedRequirement.id, selectedMaturityLevel)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}