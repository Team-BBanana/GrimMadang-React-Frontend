import React from 'react';
import style from "./FamilyComponent.module.css"
import { familyData } from "../FamilyData.ts"


interface FamilyComponentProps {
    onFamilySelect: (familyId: string) => void;
}

const FamilyComponent: React.FC<FamilyComponentProps> = ({ onFamilySelect }) => {
    return (
        <div className={style.familyContainer}>
            {familyData.map(family => (
                <div
                    key={family.id}
                    className={style.accountItem}
                    onClick={() => onFamilySelect(family.id.toString())}
                >
                    <img src={family.image} alt={family.name}/>
                    <p>{family.name}</p>
                </div>
            ))}
        </div>
    );
};

export default FamilyComponent;