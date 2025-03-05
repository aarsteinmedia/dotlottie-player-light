import type { LottieComp } from '@/types';
interface Project {
    compositions: any[];
    currentFrame: number;
}
declare const ProjectInterface: () => {
    (this: Project, name: string): any;
    compositions: any[];
    currentFrame: number;
    registerComposition: (this: Project, comp: LottieComp) => void;
};
export default ProjectInterface;
