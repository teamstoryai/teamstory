import BaseModule, { AnyBaseModule } from '@/modules/data/BaseModule'
import DataModuleFactory from '@/modules/DataModuleFactory'
import DataModule, { DataModuleProps } from '@/modules/DataModuleFactory'
import { dataStore } from '@/stores/dataStore'
import { useEffect, useState } from 'preact/hooks'

export type ModuleGroupProps = {
  modules: DataModuleProps[]
}

const ModuleGroup = ({ modules: moduleProps }: ModuleGroupProps) => {
  const [modules, setModules] = useState<AnyBaseModule[]>([])

  useEffect(() => {
    const modules = moduleProps.map((m) => DataModuleFactory(m)).filter(Boolean) as AnyBaseModule[]
    dataStore.currentDashboard = modules
    setModules(modules)
  }, [moduleProps])

  return (
    <>
      {modules.map((module, i) => {
        return <module.render key={i} />
      })}
    </>
  )
}

export default ModuleGroup
