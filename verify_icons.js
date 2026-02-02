import * as icons from 'lucide-react';

const requiredIcons = [
  'Paperclip', 'Ear', 'Zap', 'Landmark', 'CircleDot', 'BookOpen', 'Hand', 'Droplets',
  'Banana', 'Bell', 'XOctagon', 'Utensils', 'Smile', 'Rocket', 'AlertTriangle', 'PenTool', 
  'Banknote', 'Ghost', 'Scissors', 'Dices', 'Umbrella', 'CornerDownLeft', 'Bird', 'Fish', 
  'Search', 'Crown', 'Sparkles', 'Brush', 'Globe', 'Telescope', 'Skull', 'Disc', 'Package', 
  'Wine', 'Layers', 'Sword', 'Armchair', 'Grid', 'Music', 'Wind', 'EarOff', 'Flame', 
  'TreeDeciduous', 'Loader', 'Star', 'Sprout', 'Book', 'Watch', 'Hourglass', 'Activity', 
  'Keyboard', 'AlignJustify', 'Edit3', 'Droplet', 'Eraser', 'Tablet', 'HelpCircle', 'Edit2', 
  'Tool', 'CloudRain', 'Thermometer', 'Sun', 'RefreshCw', 'Radio', 'GitBranch', 'Triangle', 
  'Cat', 'Network', 'Clover', 'Shirt', 'DollarSign', 'Gem', 'Compass', 'Footprints', 
  'Crosshair', 'Eye', 'Circle', 'Snail', 'Maximize', 'Glasses', 'PartyPopper', 'Mic', 
  'Clapperboard', 'Megaphone' 
];

const missing = requiredIcons.filter(icon => !icons[icon]);

if (missing.length > 0) {
  console.log('Missing icons:', missing);
} else {
  console.log('All icons found!');
}
