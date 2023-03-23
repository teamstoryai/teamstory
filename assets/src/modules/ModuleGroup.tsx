import DataModule, { DataModuleProps } from '@/modules/DataModule'

export type ModuleGroupProps = {
  modules: DataModuleProps[]
}

const ModuleGroup = ({ modules }: ModuleGroupProps) => {
  return (
    <div>
      {modules.map((module, i) => (
        <DataModule {...module} key={i} />
      ))}
    </div>
  )
}

export default ModuleGroup
