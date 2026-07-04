const fs = require('fs');

const oldFilePath = 'C:\\\\Users\\\\Kiran C\\\\Desktop\\\\Photo Frontend 30 june\\\\Photo Frontend\\\\PhotoBook\\\\photobook\\\\src\\\\app\\\\editor\\\\[id]\\\\page.tsx';
const newFilePath = 'C:\\\\Users\\\\Kiran C\\\\Desktop\\\\Photo Frontend\\\\PhotoBook\\\\photobook\\\\src\\\\app\\\\editor\\\\[id]\\\\page.tsx';

let oldCode = fs.readFileSync(oldFilePath, 'utf-8');

// 1. Update imports
oldCode = oldCode.replace(
  'import { useParams, useRouter } from \'next/navigation\';',
  'import { useParams, useRouter, useSearchParams } from \'next/navigation\';'
);

// 2. Add guestType searchParam
oldCode = oldCode.replace(
  '  const router = useRouter();',
  '  const router = useRouter();\n  const searchParams = useSearchParams();\n  const guestType = searchParams.get(\'type\');'
);

// 3. Update useEffect
const newUseEffect = `  useEffect(() => {
    if (projectId === 'guest') {
      let defaultPages;
      if (guestType === 'polaroid') {
        defaultPages = [
          { id: 'page-1', type: 'content', background: { type: 'color', value: '#FFFFFF' }, elements: [] }
        ];
      } else {
        defaultPages = [
          { id: 'page-front', type: 'front_cover', background: { type: 'color', value: '#FFFFFF' }, elements: [] },
          ...Array.from({ length: 20 }).map((_, i) => ({ id: \`page-\${i}\`, type: 'content', background: { type: 'color', value: '#FFFFFF' }, elements: [] })),
          { id: 'page-back', type: 'back_cover', background: { type: 'color', value: '#FFFFFF' }, elements: [] }
        ];
      }
      setProject('guest', guestType === 'polaroid' ? 'My Polaroids' : 'Guest Project', {
        bookConfig: { projectType: guestType === 'polaroid' ? 'polaroid' : 'photobook', size: '10x10', coverType: 'hardcover', paperType: 'matte', pageCount: defaultPages.length },
        pages: defaultPages as any,
      });
      setLoading(false);
      return;
    }
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }`;

oldCode = oldCode.replace(
  `  useEffect(() => {\r\n    if (!authLoading && !isAuthenticated) {\r\n      router.push('/login');\r\n      return;\r\n    }`,
  newUseEffect
);

// Fallback for different line endings
oldCode = oldCode.replace(
  `  useEffect(() => {\n    if (!authLoading && !isAuthenticated) {\n      router.push('/login');\n      return;\n    }`,
  newUseEffect
);


// 4. Update AutoSave
const autoSaveOld = `  const autoSave = useCallback(async () => {\r\n    if (!isDirty || !projectId) return;`;
const autoSaveNew = `  const autoSave = useCallback(async () => {\n    if (!isDirty || !projectId || projectId === 'guest') return;`;
oldCode = oldCode.replace(autoSaveOld, autoSaveNew);

const autoSaveOldLF = `  const autoSave = useCallback(async () => {\n    if (!isDirty || !projectId) return;`;
oldCode = oldCode.replace(autoSaveOldLF, autoSaveNew);

fs.writeFileSync(newFilePath, oldCode);
console.log('Merged successfully');
