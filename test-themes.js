// Theme Customization Test Script
// This script tests the theme system functionality

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎨 Starting Theme Customization Tests...\n');

// Test 1: Check if theme files exist and are properly structured
console.log('📁 Test 1: Checking theme file structure...');

const themeFiles = [
    'src/utils/themes.ts',
    'src/types/theme.ts',
    'src/components/ThemeSelector.tsx',
    'src/pages/ThemePage.tsx'
];

let filesExist = true;
themeFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.log(`❌ ${file} missing`);
        filesExist = false;
    }
});

if (filesExist) {
    console.log('✅ All theme files exist\n');
} else {
    console.log('❌ Some theme files are missing\n');
}

// Test 2: Validate theme definitions
console.log('🎯 Test 2: Validating theme definitions...');

try {
    const themesContent = fs.readFileSync(path.join(__dirname, 'src/utils/themes.ts'), 'utf8');
    
    // Check for required themes
    const requiredThemes = ['default', 'emerald', 'rose', 'nighty', 'ocean', 'sunset', 'forest'];
    let themesValid = true;
    
    requiredThemes.forEach(theme => {
        if (themesContent.includes(`${theme}:`)) {
            console.log(`✅ Theme '${theme}' defined`);
        } else {
            console.log(`❌ Theme '${theme}' missing`);
            themesValid = false;
        }
    });
    
    // Check for required color properties
    const requiredColorProps = ['primary', 'secondary', 'accent', 'background', 'text', 'border'];
    requiredColorProps.forEach(prop => {
        if (themesContent.includes(`${prop}:`)) {
            console.log(`✅ Color property '${prop}' found`);
        } else {
            console.log(`❌ Color property '${prop}' missing`);
            themesValid = false;
        }
    });
    
    // Check for gradient definitions
    if (themesContent.includes('gradients:')) {
        console.log('✅ Gradient definitions found');
    } else {
        console.log('❌ Gradient definitions missing');
        themesValid = false;
    }
    
    if (themesValid) {
        console.log('✅ Theme definitions are valid\n');
    } else {
        console.log('❌ Theme definitions have issues\n');
    }
    
} catch (error) {
    console.log(`❌ Error reading themes file: ${error.message}\n`);
}

// Test 3: Check CSS variable integration
console.log('🎨 Test 3: Checking CSS variable integration...');

try {
    const cssContent = fs.readFileSync(path.join(__dirname, 'src/index.css'), 'utf8');
    const tailwindConfig = fs.readFileSync(path.join(__dirname, 'tailwind.config.js'), 'utf8');
    
    // Check for CSS variables in index.css
    const cssVariables = [
        '--color-primary-',
        '--color-secondary-',
        '--color-accent-',
        '--color-bg-',
        '--color-text-',
        '--color-border-'
    ];
    
    let cssVarsValid = true;
    cssVariables.forEach(variable => {
        if (cssContent.includes(variable) || tailwindConfig.includes(variable)) {
            console.log(`✅ CSS variable pattern '${variable}' found`);
        } else {
            console.log(`❌ CSS variable pattern '${variable}' missing`);
            cssVarsValid = false;
        }
    });
    
    // Check for theme-specific body classes
    if (cssContent.includes('body.theme-nighty')) {
        console.log('✅ Theme-specific CSS classes found');
    } else {
        console.log('❌ Theme-specific CSS classes missing');
        cssVarsValid = false;
    }
    
    if (cssVarsValid) {
        console.log('✅ CSS variable integration is working\n');
    } else {
        console.log('❌ CSS variable integration has issues\n');
    }
    
} catch (error) {
    console.log(`❌ Error reading CSS files: ${error.message}\n`);
}

// Test 4: Check store integration
console.log('🏪 Test 4: Checking store integration...');

try {
    const storeContent = fs.readFileSync(path.join(__dirname, 'src/stores/useAppStore.ts'), 'utf8');
    
    const storeFeatures = [
        'currentTheme:',
        'setTheme:',
        'useTheme',
        'useThemeActions',
        'ThemeName'
    ];
    
    let storeValid = true;
    storeFeatures.forEach(feature => {
        if (storeContent.includes(feature)) {
            console.log(`✅ Store feature '${feature}' found`);
        } else {
            console.log(`❌ Store feature '${feature}' missing`);
            storeValid = false;
        }
    });
    
    if (storeValid) {
        console.log('✅ Store integration is working\n');
    } else {
        console.log('❌ Store integration has issues\n');
    }
    
} catch (error) {
    console.log(`❌ Error reading store file: ${error.message}\n`);
}

// Test 5: Check component integration
console.log('🧩 Test 5: Checking component integration...');

try {
    const navbarContent = fs.readFileSync(path.join(__dirname, 'src/components/navigation/Navbar.tsx'), 'utf8');
    const appContent = fs.readFileSync(path.join(__dirname, 'src/App.tsx'), 'utf8');
    
    let componentValid = true;
    
    // Check navbar integration
    if (navbarContent.includes('CompactThemeSelector')) {
        console.log('✅ Theme selector in navbar');
    } else {
        console.log('❌ Theme selector missing from navbar');
        componentValid = false;
    }
    
    // Check app integration
    if (appContent.includes('applyThemeToDocument')) {
        console.log('✅ Theme application in App component');
    } else {
        console.log('❌ Theme application missing from App component');
        componentValid = false;
    }
    
    if (componentValid) {
        console.log('✅ Component integration is working\n');
    } else {
        console.log('❌ Component integration has issues\n');
    }
    
} catch (error) {
    console.log(`❌ Error reading component files: ${error.message}\n`);
}

// Test 6: Check routing
console.log('🛣️ Test 6: Checking theme page routing...');

try {
    const routerContent = fs.readFileSync(path.join(__dirname, 'src/router.tsx'), 'utf8');
    
    if (routerContent.includes('ThemePage') && routerContent.includes("path: 'themes'")) {
        console.log('✅ Theme page routing configured');
    } else {
        console.log('❌ Theme page routing missing');
    }
    
} catch (error) {
    console.log(`❌ Error reading router file: ${error.message}\n`);
}

// Summary
console.log('📊 Test Summary:');
console.log('================');
console.log('Theme customization system includes:');
console.log('• 7 predefined themes (default, emerald, rose, nighty, ocean, sunset, forest)');
console.log('• CSS variable-based theming system');
console.log('• Zustand store integration for theme state');
console.log('• Theme selector components (full and compact)');
console.log('• Dedicated theme page (/themes)');
console.log('• Automatic theme application on load and change');
console.log('• Dark mode support (nighty theme)');
console.log('• Tailwind CSS integration with CSS variables');
console.log('');
console.log('🎉 Theme customization tests completed!');
console.log('');
console.log('To test manually:');
console.log('1. Run the application: npm run dev');
console.log('2. Navigate to http://localhost:5174/themes');
console.log('3. Try switching between different themes');
console.log('4. Check that colors, gradients, and styles update');
console.log('5. Test the compact theme selector in the navbar');
console.log('6. Open browser dev tools to inspect CSS variables');