const manufacturerInputField = document.getElementById("manufacturerInputField");
const brandInputField = document.getElementById("brandInputField");
const manufacturerSuggestedList = document.getElementById("manufacturerSuggestedList");
const brandSuggestedList = document.getElementById("brandSuggestedList");
const deviceInputField = document.getElementById("searchDeviceField");

let manufacturers = [];
let brands = [];
let manufacturerData;
let brandData;

async function fetchManufacturerData() {
    try {
        const response = await fetch("https://api.fda.gov/device/registrationlisting.json?search=registration.name%22%22&limit=400");
        if (!response.ok) {
            throw new Error('Failed to fetch manufacturer data');
        }
        const data = await response.json();
        manufacturers = data.results.map(result => result.registration.name);
    } catch (error) {
        console.error("Error fetching manufacturer data:", error);
    }
}


async function fetchBrandData(selectedManufacturer) { 
    try {
        const response = await fetch(`https://api.fda.gov/device/registrationlisting.json?search=registration.name="${manufacturerData}"andproprietary_name="${brandData}"%22%22&limit=400`); 
        if (!response.ok) {
            throw new Error('Failed to fetch brand data');
        }
        const data = await response.json();
        brands = [];
        data.results.forEach(result => {
            result.proprietary_name.forEach(name => {
                brands.push(name);
            });
        });
    } catch (error) {
        console.error("Error fetching brand data:", error);
        alert("Failed to fetch brand data. Please try again later.");
    }
}

const handleManufacturerSearch = () => {
    const searchText = manufacturerInputField.value.toLowerCase();
    console.log(searchText);
    const filteredManufacturers = manufacturers.filter(manufacturer => manufacturer.toLowerCase().includes(searchText));
    displayManufacturerSuggestions(filteredManufacturers);
};

const handleBrandSearch = () => {
    const searchText = brandInputField.value.toLowerCase();
    const selectedManufacturer = manufacturerInputField.value.toLowerCase();
    const filteredBrands = brands.filter(brand => brand.toLowerCase().includes(searchText));
    displayBrandSuggestions(filteredBrands, selectedManufacturer); 
};

const displayManufacturerSuggestions = (suggestions) => {
    manufacturerSuggestedList.innerHTML = '';
    if (suggestions.length === 0) {
        manufacturerSuggestedList.innerHTML = '<li class="suggested-item">No manufacturers found</li>';
    } else {
        suggestions.forEach(manufacturer => {
            const listItem = document.createElement('li');
            listItem.textContent = manufacturer;
            listItem.classList.add('suggested-item');
            listItem.addEventListener('click', () => {
                manufacturerInputField.value = manufacturer;
                manufacturerData=manufacturer;
                console.log(manufacturerData);
                console.log(manufacturerInputField.value);
                manufacturerSuggestedList.innerHTML = ''; 
                manufacturerSuggestedList.classList.remove('active'); 
            });
            manufacturerSuggestedList.appendChild(listItem);
        });
        manufacturerSuggestedList.classList.add('active');
    }
};

const displayBrandSuggestions = (suggestions, selectedManufacturer) => { 
    brandSuggestedList.innerHTML = '';
    if (suggestions.length === 0) {
        brandSuggestedList.innerHTML = '<li class="suggested-item">No brands found</li>';
    } else {
        suggestions.forEach(brand => {
            const listItem = document.createElement('li');
            listItem.textContent = brand;
            listItem.classList.add('suggested-item');
            listItem.addEventListener('click', () => {
                brandInputField.value = brand;
                
                brandData = console.log(brandInputField.value);
                brandSuggestedList.innerHTML = ''; 
                brandSuggestedList.classList.remove('active'); 
                updateDeviceNames();
            });
            brandSuggestedList.appendChild(listItem);
        });
        brandSuggestedList.classList.add('active');
    }
};

async function updateDeviceNames() {
    const selectedManufacturer = manufacturerInputField.value;
    const selectedBrand = brandInputField.value;
    if (selectedManufacturer && selectedBrand) {
        try {
            const response = await fetch(`https://api.fda.gov/device/registrationlisting.json?search=device_name="${selectedManufacturer}"andproprietary_name="${selectedBrand}"`);
            if (!response.ok) {
                throw new Error('Failed to fetch device data');
            }
            const data = await response.json();
            if (data.results.length > 0) {
                deviceInputField.value = data.results[0].products[0].openfda.device_name;
            } else {
                deviceInputField.value = ""; 
            }
        } catch (error) {
            console.error("Error fetching device names:", error);
            alert("Failed to fetch device names. Please try again later.");
        }
    } else {
        deviceInputField.value = ""; 
    }
}

manufacturerInputField.addEventListener('keypress', handleManufacturerSearch);
brandInputField.addEventListener('keypress', handleBrandSearch);

manufacturerInputField.addEventListener('click', () => { manufacturerSuggestedList.classList.add('active') });
brandInputField.addEventListener('click', () => { brandSuggestedList.classList.add('active') });

manufacturerInputField.addEventListener('click', () => { 
    const selectedManufacturer = manufacturerInputField.value.toLowerCase(); 
    console.log("blur"+selectedManufacturer);
    fetchBrandData(manufacturerData); 
});

fetchManufacturerData();
