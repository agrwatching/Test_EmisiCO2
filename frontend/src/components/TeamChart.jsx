import { Tree, TreeNode } from "react-organizational-chart";
import agra from "../assets/agra.jpg";
import rizal from "../assets/rizal.jpg";
import diki from "../assets/diki.jpg";
import kiki from "../assets/kiki.jpg";
import mada from "../assets/mada.jpg";
import syahrur from "../assets/syahrur.jpg";

const Profil = ({ name, role, profession, img }) => (
  <div className="flex flex-col items-center text-white">
    <img
      src={img}
      alt={name}
      className="w-24 h-32 rounded-xl mb-2 border-2 border-white object-cover"
    />
    <strong className="text-sm">{name}</strong>
    <span className="text-xs">{role}</span>
    <span className="text-xs italic">{profession}</span>
  </div>
);

const TeamChart = () => (
  <div className="overflow-auto py-10">
    <Tree
      lineWidth="2px"
      lineColor="white"
      lineBorderRadius="10px"
      label={
        <Profil
          name="Syahrur Ramadhani"
          role="Product Owner"
          profession="Leader/Entrepreneur"
          img={syahrur} // pastikan ini foto Syahrur
        />
      }
    >
      <TreeNode
        label={
          <Profil
            name="Muhammad Rizal"
            role="UI/UX Designer"
            profession="Product Designer"
            img={rizal}
          />
        }
      />
      <TreeNode
        label={
          <Profil
            name="Dicki Agustian"
            role="Backend Developer"
            profession="PHP Dveloper"
            img={diki}
          />
        }
      />
      <TreeNode
        label={
          <Profil
            name="Agra Maesa Kusumah"
            role="Frontend Developer"
            profession="Software Engineer"
            img={agra}
          />
        }
      />
      <TreeNode
        label={
          <Profil
            name="Kiki Pauzi"
            role="DevOps Engineer"
            profession="Cloud Architect"
            img={kiki}
          />
        }
      />
      <TreeNode
        label={
          <Profil
            name="Mada Putra Andhika"
            role="Data Analyst"
            profession="AI Research Assistant"
            img={mada}
          />
        }
      />
    </Tree>
  </div>
);

export default TeamChart;
