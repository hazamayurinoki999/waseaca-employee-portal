export const schools = [
    { id: 'singapore', name: 'Singapore', label: 'シンガポール校', coordinates: [1.3521, 103.8198] },
    { id: 'inter', name: 'Inter', label: 'インター校', coordinates: [1.3521, 103.8198] },
    { id: 'kl', name: 'Kuala Lumpur', label: 'クアラルンプール校', coordinates: [3.1390, 101.6869] },
    { id: 'hcm', name: 'Ho Chi Minh', label: 'ホーチミン区校', coordinates: [10.8231, 106.6297] },
    { id: 'd7', name: 'District 7', label: '7区校', coordinates: [10.7769, 106.7009] }, // Slightly different for D7
    { id: 'taipei', name: 'Taipei', label: '台北校', coordinates: [25.0330, 121.5654] },
    { id: 'london', name: 'London', label: 'ロンドン校', coordinates: [51.5074, -0.1278] },
    { id: 'la', name: 'Los Angeles', label: 'ロサンゼルス校', coordinates: [34.0522, -118.2437] },
];

export const getSchoolById = (id) => schools.find(s => s.id === id);
