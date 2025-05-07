import DeveloperCard from '../components/DeveloperCard'

const Developer = () => {
    const developers = [
        {
            name: 'Shubham',
            role: 'Frontend Developer and Team Guide',
            image: 'https://images.stockcake.com/public/5/e/6/5e6fb906-70e0-4ec9-9df9-fb564a8fec74_large/coder-at-work-stockcake.jpg',
            github: 'https://github.com/Shubham-404',
            linkedin: 'https://linkedin.com/in/shubham-singh404'
        },
        {
            name: 'Sinchana V',
            role: 'Backend Developer and Project Manager',
            image: 'https://cdn.imago-images.com/bild/st/0201609508/s.jpg',
            github: 'https://github.com/sinch1717',
            linkedin: 'https://linkedin.com/in/sinchanav'
        },
        {
            name: 'Sree Darshan KS',
            role: 'Designer and Project Associate',
            image: 'https://images.stockcake.com/public/8/4/5/84524173-12ca-4edf-a6aa-bd7d1d551032_large/coder-at-work-stockcake.jpg',
            github: 'https://github.com/sree-darshan',
            linkedin: 'https://www.linkedin.com/in/sree-dharshan-20b19a296/'
        }
    ]

    const facultyAdvisor = {
        name: 'Mrs. Usha K Patil',
        role: 'Faculty Advisor',
        image: 'https://nie.ac.in/wp-content/uploads/2023/01/ushapatil-cse.jpg'
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-[#1D3557] mb-6">Meet the Developers of Utasava NIE</h1>

            {/* Faculty Advisor */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#1D3557] mb-3">Faculty Advisor</h2>
                <div className="flex gap-4">
                    <DeveloperCard 
                        name={facultyAdvisor.name}
                        role={facultyAdvisor.role}
                        image={facultyAdvisor.image}
                    />
                </div>
            </div>

            {/* Student Developers */}
            <div>
                <h2 className="text-xl font-semibold text-[#1D3557] mb-3">Student Developers</h2>
                <div className="flex gap-4 flex-wrap">
                    {developers.map(dev => (
                        <DeveloperCard 
                            key={dev.name}
                            name={dev.name}
                            role={dev.role}
                            image={dev.image}
                            github={dev.github}
                            linkedin={dev.linkedin}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Developer
