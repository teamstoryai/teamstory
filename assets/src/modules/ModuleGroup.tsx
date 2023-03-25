import DataModule, { DataModuleProps } from '@/modules/DataModule'

export type ModuleGroupProps = {
  modules: DataModuleProps[]
}

const ModuleGroup = ({ modules }: ModuleGroupProps) => {
  return (
    <>
      {modules.map((module, i) => (
        <DataModule {...module} key={i} />
      ))}
    </>
  )
}

export default ModuleGroup
