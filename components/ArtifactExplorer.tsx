
import React, { useState } from 'react';
import { Artifact, ArtifactType, SessionSchema } from '../types';
import { formatDriveLink } from '../utils/sessionUtils';
import { generateArtifactMetadata } from '../utils/metadataGenerator'; // Import metadata generator
import Button from './Button';

interface ArtifactExplorerProps {
  artifacts: Artifact[];
  projectScope: string;
  currentSession: SessionSchema | null; // New prop: current active session
}

const ArtifactExplorer: React.FC<ArtifactExplorerProps> = ({ artifacts, projectScope, currentSession }) => {
  const [newArtifactTitle, setNewArtifactTitle] = useState('');
  const [newArtifactType, setNewArtifactType] = useState<ArtifactType>(ArtifactType.CODE);
  const [newArtifactDrivePath, setNewArtifactDrivePath] = useState('');
  const [generatedMetadata, setGeneratedMetadata] = useState('');

  // Categorize artifacts into virtual folders
  const categorizedArtifacts: { [key: string]: Artifact[] } = {};
  artifacts.forEach(artifact => {
    // Determine virtual folder based on artifact type or drivePath
    let folderName = 'Uncategorized';
    if (artifact.drivePath) {
      // Extract the last folder name from drivePath, e.g., "specs" from "RPR-KONTROL-DOCUMENTS/ProjectName/specs/"
      const pathParts = artifact.drivePath.split('/').filter(Boolean);
      folderName = pathParts[pathParts.length - 1] || 'Drive Root';
    } else {
      switch (artifact.type) {
        case ArtifactType.PRD:
        case ArtifactType.SPEC:
          folderName = 'Specs';
          break;
        case ArtifactType.SCHEMA:
          folderName = 'Schemas';
          break;
        case ArtifactType.NOTEBOOK:
          folderName = 'Forensics';
          break;
        case ArtifactType.CODE:
          folderName = 'Code';
          break;
        case ArtifactType.GOVERNANCE_DOC:
          folderName = 'Governance';
          break;
        case ArtifactType.DEPLOYMENT:
          folderName = 'Deployments';
          break;
      }
    }
    
    if (!categorizedArtifacts[folderName]) {
      categorizedArtifacts[folderName] = [];
    }
    categorizedArtifacts[folderName].push(artifact);
  });

  const handleGenerateMetadata = () => {
    if (!currentSession || !newArtifactTitle || !newArtifactDrivePath) {
      alert('Please fill in all artifact details and ensure an active session is loaded to generate metadata.');
      return;
    }

    const tempArtifact: Artifact = {
      title: newArtifactTitle,
      type: newArtifactType,
      version: "v1.0.0", // Default version for newly created artifacts
      drivePath: newArtifactDrivePath,
      // Other optional fields like sha256, uri, driveFileId are not relevant for *generating* metadata here
    };

    const metadata = generateArtifactMetadata(
      currentSession,
      tempArtifact // Pass the constructed artifact object
    );
    setGeneratedMetadata(metadata);
    console.log("Generated Artifact Metadata (Simulated Save):", metadata);
    // In a real app, this metadata would be sent to the backend along with the artifact file.
  };

  return (
    <div className="card-style p-6 max-w-4xl mx-auto my-8 space-y-6">
      <h2 className="section-prefix text-3xl font-bold text-rpr-white text-center mb-6">Artifact Explorer</h2>

      {Object.keys(categorizedArtifacts).length === 0 ? (
        <p className="text-gray-400 text-center">No artifacts found for the selected criteria.</p>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
          {Object.entries(categorizedArtifacts).map(([folder, folderArtifacts]) => (
            <div key={folder} className="bg-rpr-charcoal p-4 rounded-md border border-rpr-slate">
              <h3 className="section-prefix text-xl font-semibold text-rpr-cyan mb-3">
                 {folder.toUpperCase()}
              </h3>
              <ul className="space-y-2 text-rpr-white">
                {folderArtifacts.map((artifact, idx) => (
                  <li key={idx} className="flex items-start justify-between bg-rpr-slate p-2 rounded-sm border border-rpr-charcoal">
                    <span className="text-sm font-medium">
                      {artifact.title} (v{artifact.version})
                      {artifact.filePath && <span className="text-xs text-gray-400 ml-2">({artifact.filePath})</span>}
                    </span>
                    {artifact.driveFileId ? (
                      <a 
                        href={formatDriveLink(artifact.driveFileId) || '#'}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-rpr-cyan hover:underline text-sm flex items-center gap-1 ml-4 flex-shrink-0"
                      >
                        View in Drive
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M19.5 7.5l-1.221 1.221A3.75 3.75 0 0015 9.75a3.75 3.75 0 00-2.479.879L12 10.5l-1.221-1.221A3.75 3.75 0 007.5 7.5c-1.637 0-3.185.676-4.221 1.855l-.16.173a.75.75 0 001.076 1.054l.16-.174a2.25 2.25 0 013.064-.374l1.221 1.222a.75.75 0 001.06 0l1.221-1.222a2.25 2.25 0 013.064.374l.16.173a.75.75 0 101.075-1.053l-.16-.174C20.685 8.176 19.137 7.5 17.5 7.5z" />
                        </svg>
                      </a>
                    ) : (
                      artifact.uri && artifact.type === ArtifactType.DEPLOYMENT ? (
                        <a 
                          href={artifact.uri}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-rpr-cyan hover:underline text-sm flex items-center gap-1 ml-4 flex-shrink-0"
                        >
                          Live Link
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-7.207 7.207a3.75 3.75 0 005.304 5.304L17.704 14.25H10.5a.75.75 0 000 1.5h11.25v-4.5l-3.513-3.513zm-9.302 1.2a1.5 1.5 0 00-2.121 0c-.293.293-.455.698-.455 1.116V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H9.9z" clipRule="evenodd" />
                          </svg>
                        </a>
                      ) : (
                         <span className="text-gray-500 text-xs ml-4 flex-shrink-0">No Drive Link</span>
                      )
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Conceptual "Add New Artifact" section */}
      <div className="card-style p-4 mt-8 space-y-4">
        <h3 className="section-prefix text-xl font-bold text-rpr-white mb-4">Add New Artifact (Simulated)</h3>
        {!currentSession && <p className="text-red-400 mb-4">An active session is required to add new artifacts and generate metadata.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="artifactTitle" className="block text-rpr-white text-sm font-bold mb-2">Artifact Title</label>
            <input
              type="text"
              id="artifactTitle"
              className="input-style"
              value={newArtifactTitle}
              onChange={(e) => setNewArtifactTitle(e.target.value)}
              placeholder="e.g., Q1 Financial Report"
              disabled={!currentSession}
            />
          </div>
          <div>
            <label htmlFor="artifactType" className="block text-rpr-white text-sm font-bold mb-2">Artifact Type</label>
            <select
              id="artifactType"
              className="input-style"
              value={newArtifactType}
              onChange={(e) => setNewArtifactType(e.target.value as ArtifactType)}
              disabled={!currentSession}
            >
              {Object.values(ArtifactType).map((type) => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="artifactDrivePath" className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
              Sovereign Drive Path
            </label>
            <input
              type="text"
              id="artifactDrivePath"
              className="input-style"
              value={newArtifactDrivePath}
              onChange={(e) => setNewArtifactDrivePath(e.target.value)}
              placeholder="e.g., RPR-KONTROL-DOCUMENTS/ProjectName/specs/"
              disabled={!currentSession}
            />
            <p className="text-[10px] text-slate-600 mt-1 italic">
              Format: Root/Namespace/Directory/
            </p>
          </div>
        </div>
        <div className="text-center mt-6">
          <Button onClick={handleGenerateMetadata} disabled={!currentSession || !newArtifactTitle || !newArtifactDrivePath} variant="primary">
            Generate Metadata (Simulate Save)
          </Button>
        </div>
        {generatedMetadata && (
          <div className="mt-4 p-3 bg-rpr-slate rounded-md text-sm break-all">
            <h4 className="font-bold text-rpr-cyan mb-2">// GENERATED_ARTIFACT_METADATA.json</h4>
            <pre className="whitespace-pre-wrap text-gray-200 custom-scrollbar max-h-40 overflow-y-auto">{generatedMetadata}</pre>
            <p className="text-xs text-gray-400 mt-2">// In a live system, this metadata would be uploaded alongside the artifact file to Google Drive.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtifactExplorer;
