import React, { useState, useEffect, useCallback } from 'react';

// --- Local Storage Helper Functions ---
const getFromLocalStorage = (key) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error parsing data from localStorage for key "${key}":`, error);
        return [];
    }
};

const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving data to localStorage for key "${key}":`, error);
    }
};

// --- Reusable Component for Adding/Editing Resources ---
const ResourceForm = ({ onSubmit, onCancel, initialData = {}, title }) => {
    const [name, setName] = useState(initialData.name || '');
    const [link, setLink] = useState(initialData.link || '');
    const [notes, setNotes] = useState(initialData.notes || '');
    const [category, setCategory] = useState(initialData.category || ''); // For ML/AI or general resources

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, link, notes, category });
        // Reset form fields after submission if it's a new entry
        if (!initialData.id) {
            setName('');
            setLink('');
            setNotes('');
            setCategory('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="resource-form">
            <h3 className="form-title">{title}</h3>
            <div className="form-grid">
                <div className="form-group">
                    <label htmlFor="resourceName">Name:</label>
                    <input
                        type="text"
                        id="resourceName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="resourceLink">Link (URL):</label>
                    <input
                        type="url"
                        id="resourceLink"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </div>
                {/* Only show category for ML/AI resources (DSA now a single tab) */}
                {title.includes("ML/AI") && (
                    <div className="form-group full-width">
                        <label htmlFor="resourceCategory">
                            Category (e.g., Library, Concept, Tool):
                        </label>
                        <input
                            type="text"
                            id="resourceCategory"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g., TensorFlow, NLP, General"
                        />
                    </div>
                )}
                <div className="form-group full-width">
                    <label htmlFor="resourceNotes">Notes:</label>
                    <textarea
                        id="resourceNotes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="3"
                    ></textarea>
                </div>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn-primary">
                    {initialData.id ? 'Update Resource' : 'Add Resource'}
                </button>
                <button type="button" onClick={onCancel} className="btn-secondary">
                    Cancel
                </button>
            </div>
        </form>
    );
};

// --- Main App Component ---
function App() {
    // --- Main Tab State ---
    const [currentPage, setCurrentPage] = useState('languages');

    // --- Sub-Tab States ---
    const [activeLangTab, setActiveLangTab] = useState('python');
    const [activeMLTab, setActiveMLTab] = useState('general');
    // Removed: const [activeDSATab, setActiveDSATab] = useState('arrays_hashing'); // Default DSA sub-tab

    // --- Data States (using localStorage for persistence) ---
    const [pythonResources, setPythonResources] = useState([]);
    const [jsResources, setJsResources] = useState([]);
    const [javaResources, setJavaResources] = useState([]);
    const [cssResources, setCssResources] = useState([]);
    const [htmlResources, setHtmlResources] = useState([]);
    const [reactResources, setReactResources] = useState([]);
    const [cppResources, setCppResources] = useState([]);
    const [csharpResources, setCsharpResources] = useState([]);

    const [practiceWebsites, setPracticeWebsites] = useState([]);

    const [mlGeneralResources, setMlGeneralResources] = useState([]);
    const [tfResources, setTfResources] = useState([]);
    const [pytorchResources, setPytorchResources] = useState([]);
    const [sklearnResources, setSklearnResources] = useState([]);
    const [nlpResources, setNlpResources] = useState([]);
    const [cvResources, setCvResources] = useState([]);
    const [mlOthersResources, setMlOthersResources] = useState([]);

    // NEW: Single DSA Resource State
    const [dsaResources, setDsaResources] = useState([]);

    const [projectResources, setProjectResources] = useState([]);
    const [additionalResources, setAdditionalResources] = useState([]);

    // --- Editing States for Forms ---
    const [editingResource, setEditingResource] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [message, setMessage] = useState('');

    // --- Load Data from Local Storage on Mount ---
    useEffect(() => {
        setPythonResources(getFromLocalStorage('pythonResources'));
        setJsResources(getFromLocalStorage('jsResources'));
        setJavaResources(getFromLocalStorage('javaResources'));
        setCssResources(getFromLocalStorage('cssResources'));
        setHtmlResources(getFromLocalStorage('htmlResources'));
        setReactResources(getFromLocalStorage('reactResources'));
        setCppResources(getFromLocalStorage('cppResources'));
        setCsharpResources(getFromLocalStorage('csharpResources'));
        setPracticeWebsites(getFromLocalStorage('practiceWebsites'));
        setMlGeneralResources(getFromLocalStorage('mlGeneralResources'));
        setTfResources(getFromLocalStorage('tfResources'));
        setPytorchResources(getFromLocalStorage('pytorchResources'));
        setSklearnResources(getFromLocalStorage('sklearnResources'));
        setNlpResources(getFromLocalStorage('nlpResources'));
        setCvResources(getFromLocalStorage('cvResources'));
        setMlOthersResources(getFromLocalStorage('mlOthersResources'));
        
        // NEW: Load single DSA data from Local Storage
        setDsaResources(getFromLocalStorage('dsaResources'));

        setProjectResources(getFromLocalStorage('projectResources'));
        setAdditionalResources(getFromLocalStorage('additionalResources'));
    }, []);

    // --- Message Display Logic ---
    const showMessage = useCallback((msg) => {
        setMessage(msg);
        const timer = setTimeout(() => {
            setMessage('');
        }, 3000); // Message disappears after 3 seconds
        return () => clearTimeout(timer); // Cleanup on unmount or re-render
    }, []);

    // --- Generic CRUD Functions for Resources ---
    const addResource = useCallback((resourceData, setter, localStorageKey) => {
        const newResource = { id: Date.now().toString(), ...resourceData };
        setter(prevResources => {
            const updatedResources = [...prevResources, newResource];
            saveToLocalStorage(localStorageKey, updatedResources);
            return updatedResources;
        });
        showMessage('Resource added successfully!');
        setShowAddForm(false);
    }, [showMessage]);

    const updateResource = useCallback((id, resourceData, setter, localStorageKey) => {
        setter(prevResources => {
            const updatedResources = prevResources.map(res =>
                res.id === id ? { ...res, ...resourceData } : res
            );
            saveToLocalStorage(localStorageKey, updatedResources);
            return updatedResources;
        });
        showMessage('Resource updated successfully!');
        setEditingResource(null);
        setShowAddForm(false);
    }, [showMessage]);

    const deleteResource = useCallback((id, setter, localStorageKey) => {
        setter(prevResources => {
            const updatedResources = prevResources.filter(res => res.id !== id);
            saveToLocalStorage(localStorageKey, updatedResources);
            return updatedResources;
        });
        showMessage('Resource deleted successfully!');
    }, [showMessage]);

    // --- Helper to get current resources and their setter/key based on active tabs ---
    const getCurrentResourceState = useCallback(() => {
        switch (currentPage) {
            case 'languages':
                switch (activeLangTab) {
                    case 'python': return [pythonResources, setPythonResources, 'pythonResources'];
                    case 'javascript': return [jsResources, setJsResources, 'jsResources'];
                    case 'java': return [javaResources, setJavaResources, 'javaResources'];
                    case 'css': return [cssResources, setCssResources, 'cssResources'];
                    case 'html': return [htmlResources, setHtmlResources, 'htmlResources'];
                    case 'react': return [reactResources, setReactResources, 'reactResources'];
                    case 'cpp': return [cppResources, setCppResources, 'cppResources'];
                    case 'csharp': return [csharpResources, setCsharpResources, 'csharpResources'];
                    default: return [[], () => {}, ''];
                }
            case 'practice':
                return [practiceWebsites, setPracticeWebsites, 'practiceWebsites'];
            case 'ml_ai':
                switch (activeMLTab) {
                    case 'general': return [mlGeneralResources, setMlGeneralResources, 'mlGeneralResources'];
                    case 'tensorflow': return [tfResources, setTfResources, 'tfResources'];
                    case 'pytorch': return [pytorchResources, setPytorchResources, 'pytorchResources'];
                    case 'sklearn': return [sklearnResources, setSklearnResources, 'sklearnResources'];
                    case 'nlp': return [nlpResources, setNlpResources, 'nlpResources'];
                    case 'computer_vision': return [cvResources, setCvResources, 'cvResources'];
                    case 'Others': return [mlOthersResources, setMlOthersResources, 'mlOthersResources'];
                    default: return [[], () => {}, ''];
                }
            // NEW: Case for DSA tab (simplified)
            case 'dsa':
                return [dsaResources, setDsaResources, 'dsaResources'];
            case 'projects':
                return [projectResources, setProjectResources, 'projectResources'];
            case 'additional_resources':
                return [additionalResources, setAdditionalResources, 'additionalResources'];
            default:
                return [[], () => {}, ''];
        }
    }, [
        currentPage, activeLangTab, activeMLTab, // activeDSATab removed
        pythonResources, jsResources, javaResources, cssResources, htmlResources, reactResources, cppResources, csharpResources,
        practiceWebsites,
        mlGeneralResources, tfResources, pytorchResources, sklearnResources, nlpResources, cvResources, mlOthersResources,
        // NEW: Only single DSA resource state in dependencies
        dsaResources,
        projectResources, additionalResources
    ]);

    // --- Handle form submission for current active section ---
    const handleResourceFormSubmit = (data) => {
        const [currentResources, setter, localStorageKey] = getCurrentResourceState();
        if (editingResource) {
            updateResource(editingResource.id, data, setter, localStorageKey);
        } else {
            addResource(data, setter, localStorageKey);
        }
    };

    const handleCancelForm = () => {
        setShowAddForm(false);
        setEditingResource(null);
    };

    // --- Render Function for Resource List ---
    const renderResourceList = (resources, setter, localStorageKey) => (
        <div className="resource-list-grid">
            {resources.length === 0 ? (
                <p className="no-resources-message">No resources added yet. Click "Add New" to get started!</p>
            ) : (
                resources.map(res => (
                    <div key={res.id} className="resource-item">
                        <div>
                            <h4 className="resource-name">{res.name}</h4>
                            {res.link && (
                                <p className="resource-link">
                                    <a href={res.link} target="_blank" rel="noopener noreferrer">
                                        {res.link}
                                    </a>
                                </p>
                            )}
                            {res.category && (
                                <p className="resource-category">
                                    Category: <span>{res.category}</span>
                                </p>
                            )}
                            {res.notes && (
                                <p className="resource-notes">{res.notes}</p>
                            )}
                        </div>
                        <div className="resource-actions">
                            <button
                                onClick={() => { setEditingResource(res); setShowAddForm(true); }}
                                className="btn-edit"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteResource(res.id, setter, localStorageKey)}
                                className="btn-delete"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );

    // --- Render Main Page Content ---
    const renderPageContent = () => {
        const [currentResources, setter, localStorageKey] = getCurrentResourceState();
        const formTitlePrefix = editingResource ? 'Edit' : 'Add New';

        return (
            <div className="page-content-area">
                {message && (
                    <div className="app-message">
                        {message}
                    </div>
                )}

                {showAddForm || editingResource ? (
                    <ResourceForm
                        onSubmit={handleResourceFormSubmit}
                        onCancel={handleCancelForm}
                        initialData={editingResource || {}}
                        title={`${formTitlePrefix} Resource`}
                    />
                ) : (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="btn-add-new"
                    >
                        Add New Resource
                    </button>
                )}

                {renderResourceList(currentResources, setter, localStorageKey)}
            </div>
        );
    };

    return (
        <>
            {/* CSS styles integrated directly into the component */}
            <style>
                {`
                /* App.css */

                /* Font Import */
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap'); /* Added for code/mono feel */


                /* Base Styles */
                html, body, #root {
                    height: 100%;
                    margin: 0;
                    overflow-x: hidden; /* Prevent horizontal scroll */
                    font-family: 'Inter', sans-serif;
                    background-color: #e0f2f7; /* Light blue background */
                    color: #334155; /* Default text color */
                }

                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 10px; /* Slightly wider */
                    height: 10px;
                }

                ::-webkit-scrollbar-track {
                    background: #f0f8ff; /* Lighter track */
                    border-radius: 10px;
                }

                ::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                    border: 2px solid #f0f8ff; /* Border to make thumb appear slimmer and float */
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }

                /* App Container */
                .app-container {
                    max-width: 1200px;
                    margin: 32px auto;
                    background-color: #ffffff;
                    border-radius: 12px; /* More rounded */
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15); /* Stronger shadow */
                    overflow: hidden;
                    padding: 16px;
                    animation: fadeIn 0.8s ease-out; /* Fade in animation for the whole app */
                }

                /* Keyframe for fadeIn */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Main Title */
                .main-title {
                    font-size: 2.5rem; /* Larger */
                    font-weight: 800;
                    text-align: center;
                    color: #1e3a8a; /* Darker blue */
                    padding: 24px 16px; /* More vertical padding, consistent horizontal */
                    background: linear-gradient(135deg, #eff6ff, #dbeafe); /* Gradient background */
                    border-bottom: 2px solid #a7d9f7; /* Subtle bottom border */
                    border-top-left-radius: 12px; /* Match app container */
                    border-top-right-radius: 12px; /* Match app container */
                    margin-bottom: 0;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.05); /* Subtle text shadow */
                }

                /* Main Navigation Tabs */
                .main-nav-tabs {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    background-color: #dbeafe; /* Blue-100 */
                    border-bottom: 1px solid #bfdbfe;
                    padding: 0 16px; /* Add some horizontal padding */
                    box-shadow: inset 0 -2px 5px rgba(0,0,0,0.05); /* Inner shadow for depth */
                }

                .main-nav-tab {
                    padding: 14px 28px; /* More padding for a bolder look */
                    font-size: 1.15rem; /* Slightly larger */
                    font-weight: 600; /* Semibold */
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* More complex, snappier transition */
                    border: none;
                    background: none;
                    cursor: pointer;
                    color: #1d4ed8;
                    outline: none;
                    position: relative; /* For the active tab indicator */
                    overflow: hidden; /* For ripple effect or similar */
                    margin: 0 2px; /* Small gap between tabs */
                }

                .main-nav-tab::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 3px; /* Indicator line */
                    background-color: #2563eb; /* Blue-600 */
                    transform: scaleX(0); /* Hidden by default */
                    transition: transform 0.3s ease-out;
                }

                .main-nav-tab:hover {
                    background-color: #bfdbfe;
                    color: #1a365d; /* Darken text on hover */
                    transform: translateY(-2px); /* Slight lift */
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08); /* Subtle shadow on hover */
                }

                .main-nav-tab.active {
                    background-color: #2563eb;
                    color: #ffffff;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Stronger shadow for active */
                    z-index: 1;
                    transform: translateY(-2px); /* Keep lifted */
                    border-bottom-left-radius: 0; /* Remove rounding for active tab bottom */
                    border-bottom-right-radius: 0;
                }

                .main-nav-tab.active::before {
                    transform: scaleX(1); /* Show indicator for active tab */
                    background-color: #ffffff; /* White indicator for active tab */
                    height: 4px; /* Thicker active indicator */
                }

                /* Sub-Navigation Tabs */
                .sub-nav-tabs {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    background-color: #f8fafc; /* Lighter background */
                    border-bottom: 1px solid #e2e8f0; /* Lighter border */
                    padding: 12px 0; /* More padding */
                    box-shadow: inset 0 -1px 3px rgba(0,0,0,0.03); /* Subtle inner shadow */
                }

                .sub-nav-tab {
                    padding: 10px 20px; /* More padding */
                    font-size: 0.95rem; /* Slightly larger */
                    font-weight: 500;
                    border-radius: 8px; /* More rounded */
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); /* Fast transition */
                    margin: 6px 6px; /* Increased margin */
                    border: none;
                    background: #e0e7ff; /* Default background for sub-tabs */
                    cursor: pointer;
                    outline: none;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Subtle shadow */
                    color: #4338ca; /* Default sub-tab color */
                }

                .sub-nav-tab:hover {
                    transform: translateY(-2px) scale(1.02); /* Lift and slightly enlarge on hover */
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Stronger shadow on hover */
                    background-color: #c7d2fe; /* Lighter shade on hover */
                }

                .lang-sub-tabs .sub-nav-tab {
                    color: #4338ca; /* Indigo-700 */
                    background-color: #eef2ff; /* Light indigo background */
                }
                .lang-sub-tabs .sub-nav-tab:hover {
                    background-color: #c7d2fe; /* Indigo-200 */
                }
                .lang-sub-tabs .sub-nav-tab.active {
                    background-color: #4f46e5; /* Indigo-600 */
                    color: #ffffff;
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15); /* Stronger shadow for active */
                    transform: translateY(-2px);
                }

                .ml-sub-tabs .sub-nav-tab {
                    color: #7e22ce; /* Purple-700 */
                    background-color: #f3e8ff; /* Light purple background */
                }
                .ml-sub-tabs .sub-nav-tab:hover {
                    background-color: #e9d5ff; /* Purple-200 */
                }
                .ml-sub-tabs .sub-nav-tab.active {
                    background-color: #9333ea; /* Purple-600 */
                    color: #ffffff;
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15); /* Stronger shadow for active */
                    transform: translateY(-2px);
                }

                /* Removed: DSA Sub-Navigation Tabs Styling */


                /* Page Content Area */
                .page-content-area {
                    padding: 32px; /* More padding */
                    background-color: #ffffff; /* White background */
                    min-height: calc(100vh - 120px); /* Adjust height based on header/nav */
                    border-bottom-left-radius: 12px; /* Match app container */
                    border-bottom-right-radius: 12px; /* Match app container */
                    box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.08); /* Stronger inner shadow */
                }

                /* Message Display */
                .app-message {
                    background-color: #d1fae5; /* Green-100 */
                    border: 1px solid #34d399; /* Green-400 */
                    color: #065f46; /* Green-700 */
                    padding: 14px 20px; /* More padding */
                    border-radius: 8px; /* More rounded */
                    margin-bottom: 24px; /* More space below */
                    font-weight: 600; /* Semibold */
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
                    animation: slideInFromTop 0.5s ease-out forwards; /* Animation for messages */
                }

                @keyframes slideInFromTop {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Add New Button */
                .btn-add-new {
                    background-color: #2563eb; /* Blue-600 */
                    color: #ffffff;
                    font-weight: 700;
                    padding: 10px 24px; /* More padding */
                    border-radius: 8px; /* More rounded */
                    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3); /* Stronger, colored shadow */
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* Snappy transition */
                    border: none;
                    cursor: pointer;
                    margin-bottom: 32px; /* More space below */
                    font-size: 1rem; /* Slightly larger text */
                    letter-spacing: 0.5px; /* Spacing for readability */
                }

                .btn-add-new:hover {
                    background-color: #1d4ed8; /* Darker blue */
                    transform: translateY(-3px); /* More pronounced lift */
                    box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4); /* Even stronger shadow */
                }

                .btn-add-new:active {
                    transform: translateY(0); /* Press down effect */
                    box-shadow: 0 2px 5px rgba(37, 99, 235, 0.2); /* Smaller shadow when pressed */
                }


                /* Resource Form */
                .resource-form {
                    padding: 32px; /* More padding */
                    background-color: #ffffff;
                    border-radius: 12px; /* More rounded */
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Stronger shadow */
                    margin-bottom: 32px; /* More space below */
                    border: 1px solid #e2e8f0; /* Subtle border */
                    animation: slideInFromBottom 0.6s ease-out; /* Animation for the form */
                }

                @keyframes slideInFromBottom {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .form-title {
                    font-size: 1.5rem; /* Larger title */
                    font-weight: 700; /* Bold */
                    margin-bottom: 24px; /* More space */
                    color: #1e3a8a; /* Darker blue */
                    text-align: center;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px; /* More gap */
                }

                @media (min-width: 768px) { /* md breakpoint */
                    .form-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .form-group.full-width {
                        grid-column: span 2;
                    }
                }

                .form-group label {
                    display: block;
                    font-size: 0.95rem; /* Slightly larger */
                    font-weight: 600; /* Semibold */
                    color: #374151; /* Gray-700 */
                    margin-bottom: 6px; /* More space */
                }

                .form-group input,
                .form-group textarea {
                    display: block;
                    width: 100%;
                    padding: 10px 14px; /* More padding */
                    border: 1px solid #cbd5e0; /* Gray-400 */
                    border-radius: 8px; /* More rounded */
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08); /* Stronger inner shadow */
                    outline: none;
                    transition: border-color 0.3s ease, box-shadow 0.3s ease;
                    font-size: 0.95rem; /* Slightly larger font */
                    font-family: 'Inter', sans-serif; /* Ensure consistent font */
                }

                .form-group input:focus,
                .form-group textarea:focus {
                    border-color: #3b82f6; /* Blue-500 */
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3); /* Stronger ring blue-500 */
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 16px; /* More gap */
                    margin-top: 32px; /* More margin */
                }

                .btn-primary, .btn-secondary {
                    display: inline-flex;
                    align-items: center; /* Center text vertically */
                    justify-content: center;
                    padding: 10px 20px; /* Consistent padding */
                    border: 1px solid transparent;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Standard shadow */
                    font-size: 0.9rem; /* Slightly larger text */
                    font-weight: 600; /* Semibold */
                    border-radius: 8px; /* More rounded */
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); /* Faster transition */
                    cursor: pointer;
                    outline: none;
                    text-transform: uppercase; /* Uppercase text for buttons */
                    letter-spacing: 0.7px; /* Spacing */
                }

                .btn-primary {
                    color: #ffffff;
                    background-color: #2563eb; /* Blue-600 */
                    box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2); /* Colored shadow for primary */
                }

                .btn-primary:hover {
                    background-color: #1d4ed8; /* Darker blue */
                    transform: translateY(-2px); /* Slight lift */
                    box-shadow: 0 6px 12px rgba(37, 99, 235, 0.3); /* Stronger shadow */
                }
                .btn-primary:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 5px rgba(37, 99, 235, 0.1);
                }

                .btn-secondary {
                    border-color: #cbd5e0; /* Gray-300 */
                    color: #374151; /* Gray-700 */
                    background-color: #ffffff;
                }

                .btn-secondary:hover {
                    background-color: #f1f5f9; /* Lighter gray */
                    transform: translateY(-2px); /* Slight lift */
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Stronger shadow */
                }
                .btn-secondary:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
                }

                /* Resource List Grid */
                .resource-list-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 32px; /* More space between cards */
                    margin-top: 32px; /* More margin */
                }

                @media (min-width: 768px) { /* md breakpoint */
                    .resource-list-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (min-width: 1024px) { /* lg breakpoint */
                    .resource-list-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                .no-resources-message {
                    grid-column: span 1;
                    text-align: center;
                    color: #64748b; /* Slate-500 */
                    font-size: 1.1rem; /* Slightly larger */
                    font-style: italic; /* Italic */
                    padding: 40px 20px; /* More padding */
                    background-color: #fdfefe; /* Off-white background */
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }

                @media (min-width: 768px) {
                    .no-resources-message {
                        grid-column: span 2;
                    }
                }

                @media (min-width: 1024px) {
                    .no-resources-message {
                        grid-column: span 3;
                    }
                }


                /* Individual Resource Item */
                .resource-item {
                    background-color: #ffffff;
                    padding: 24px; /* More padding */
                    border-radius: 12px; /* More rounded */
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); /* Stronger shadow */
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    transition: transform 0.2s ease-out, box-shadow 0.2s ease-out; /* Smooth hover transition */
                    border-left: 5px solid; /* Dynamic border based on category */
                    animation: cardAppear 0.5s ease-out forwards; /* Fade in animation for cards */
                    transform-origin: center bottom; /* For a subtle pop-up effect */
                }

                @keyframes cardAppear {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                /* Dynamic border colors for resource items (example) */
                .resource-item:nth-child(3n+1) { border-left-color: #3b82f6; /* Blue */ }
                .resource-item:nth-child(3n+2) { border-left-color: #8b5cf6; /* Violet */ }
                .resource-item:nth-child(3n+3) { border-left-color: #f59e0b; /* Amber */ }


                .resource-item:hover {
                    transform: translateY(-5px) scale(1.01); /* Lift and slightly enlarge */
                    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2); /* Stronger shadow on hover */
                }

                .resource-name {
                    font-size: 1.25rem; /* Larger */
                    font-weight: 700; /* Bold */
                    color: #1e40af; /* Darker blue */
                    margin-bottom: 12px; /* More space */
                    line-height: 1.3;
                }

                .resource-link {
                    font-size: 0.95rem; /* Slightly larger */
                    color: #4b5563;
                    margin-bottom: 12px;
                    word-break: break-all;
                    font-family: 'Roboto Mono', monospace; /* Monospaced font for links */
                }

                .resource-link a {
                    color: #3b82f6;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .resource-link a:hover {
                    text-decoration: underline;
                    color: #1d4ed8; /* Darker blue on hover */
                }

                .resource-category {
                    font-size: 0.8rem; /* Slightly larger */
                    color: #6b7280;
                    margin-bottom: 12px;
                    background-color: #e2e8f0; /* Light gray background for category */
                    padding: 4px 8px;
                    border-radius: 4px;
                    display: inline-block; /* To contain background */
                    font-weight: 500;
                }

                .resource-category span {
                    font-weight: 600; /* Semibold */
                    color: #374151;
                }

                .resource-notes {
                    font-size: 0.9rem; /* Slightly larger */
                    color: #374151;
                    margin-top: 12px;
                    flex-grow: 1; /* Allow notes to take up available space */
                    line-height: 1.5;
                }

                .resource-actions {
                    margin-top: 20px; /* More space */
                    display: flex;
                    gap: 12px; /* More gap */
                }

                .btn-edit, .btn-delete {
                    flex: 1;
                    font-size: 0.85rem; /* Slightly smaller text for action buttons */
                    font-weight: 600; /* Semibold */
                    padding: 10px 15px; /* More padding */
                    border-radius: 8px; /* More rounded */
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); /* Snappy transition */
                    border: none;
                    cursor: pointer;
                    outline: none;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .btn-edit {
                    background-color: #f59e0b; /* Yellow-500 */
                    color: #ffffff;
                }

                .btn-edit:hover {
                    background-color: #d97706; /* Yellow-600 */
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3); /* Colored shadow */
                }
                .btn-edit:active {
                    transform: translateY(0);
                    box-shadow: 0 1px 3px rgba(245, 158, 11, 0.1);
                }

                .btn-delete {
                    background-color: #ef4444; /* Red-500 */
                    color: #ffffff;
                }

                .btn-delete:hover {
                    background-color: #dc2626; /* Red-600 */
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3); /* Colored shadow */
                }
                .btn-delete:active {
                    transform: translateY(0);
                    box-shadow: 0 1px 3px rgba(239, 68, 68, 0.1);
                }

                /* Responsive adjustments for smaller screens */
                @media (max-width: 640px) {
                    .main-title {
                        font-size: 2rem;
                        padding: 20px;
                    }

                    .main-nav-tab, .sub-nav-tab {
                        font-size: 0.85rem;
                        padding: 10px 15px;
                        margin: 4px 2px;
                    }

                    .app-container {
                        margin: 16px auto;
                        padding: 8px;
                        border-radius: 8px;
                        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
                    }

                    .page-content-area {
                        padding: 20px;
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                        box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.05);
                    }

                    .resource-form {
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
                    }

                    .form-title {
                        font-size: 1.3rem;
                        margin-bottom: 20px;
                    }

                    .form-actions {
                        flex-direction: column;
                        gap: 10px;
                        margin-top: 20px;
                    }

                    .btn-primary, .btn-secondary {
                        width: 100%;
                        padding: 12px 16px; /* A bit more vertical padding for full width */
                    }

                    .resource-list-grid {
                        gap: 20px;
                    }

                    .resource-item {
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
                    }

                    .resource-actions {
                        flex-direction: column;
                        gap: 10px;
                        margin-top: 16px;
                    }

                    .btn-edit, .btn-delete {
                        width: 100%;
                        padding: 10px 15px;
                    }

                    .no-resources-message {
                        padding: 30px 15px;
                    }
                }
                `}
            </style>

            <div className="app-container">
                <h1 className="main-title">My Coding & ML/AI Guide</h1>

                {/* Main Navigation Tabs */}
                <div className="main-nav-tabs">
                    {['languages', 'practice', 'ml_ai', 'dsa', 'projects', 'additional_resources'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => {
                                setCurrentPage(tab);
                                setShowAddForm(false); // Hide form when switching main tabs
                                setEditingResource(null); // Clear editing state
                            }}
                            className={`main-nav-tab ${currentPage === tab ? 'active' : ''}`}
                        >
                            {tab.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </button>
                    ))}
                </div>

                {/* Sub-Navigation Tabs (Conditional Rendering) */}
                {currentPage === 'languages' && (
                    <div className="sub-nav-tabs lang-sub-tabs">
                        {['python', 'javascript', 'java', 'css', 'html', 'react', 'c++', 'Others'].map(subTab => (
                            <button
                                key={subTab}
                                onClick={() => {
                                    setActiveLangTab(subTab);
                                    setShowAddForm(false);
                                    setEditingResource(null);
                                }}
                                className={`sub-nav-tab ${activeLangTab === subTab ? 'active' : ''}`}
                            >
                                {subTab.charAt(0).toUpperCase() + subTab.slice(1)}
                            </button>
                        ))}
                    </div>
                )}

                {currentPage === 'ml_ai' && (
                    <div className="sub-nav-tabs ml-sub-tabs">
                        {['general', 'tensorflow', 'pytorch', 'sklearn', 'Libraries', 'computer_vision', 'Others'].map(subTab => (
                            <button
                                key={subTab}
                                onClick={() => {
                                    setActiveMLTab(subTab);
                                    setShowAddForm(false);
                                    setEditingResource(null);
                                }}
                                className={`sub-nav-tab ${activeMLTab === subTab ? 'active' : ''}`}
                            >
                                {subTab.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </button>
                        ))}
                    </div>
                )}

                {/* Removed DSA Sub-Navigation Tabs */}
                {/* When currentPage is 'dsa', no sub-tabs will be rendered */}

                {/* Render Content Based on Active Tabs */}
                {renderPageContent()}
            </div>
        </>
    );
}

export default App;
