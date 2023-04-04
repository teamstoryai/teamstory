import BaseModule from '@/modules/data/BaseModule'
import DataModule from '@/modules/ui/CardFrame'
import { useState } from 'preact/hooks'

export type ComingSoonModuleProps = {
  title: string
}

export default class ComingSoonModule extends BaseModule<ComingSoonModuleProps, void> {
  fetchData = async (clearCache?: boolean) => {}

  render = () => {
    return (
      <DataModule title={this.props.title} className="lg:col-span-2">
        <div class="flex flex-col w-full gap-2">Answers to this question are coming soon...</div>
      </DataModule>
    )
  }
}
